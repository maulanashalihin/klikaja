"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const uuid_1 = require("uuid");
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
class TagController {
    async index(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const tags = await DB_1.default.from('tags')
                .where('user_id', user.id)
                .orderBy('name', 'asc');
            return response.json({
                success: true,
                data: tags
            });
        }
        catch (error) {
            console.error('Error fetching tags:', error);
            return response.status(500).json({
                error: 'Failed to fetch tags'
            });
        }
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const { name, color, description } = await request.json();
            if (!name || name.trim().length === 0) {
                return response.status(400).json({
                    error: 'Tag name is required'
                });
            }
            const slug = generateSlug(name);
            const existing = await DB_1.default.from('tags')
                .where({ user_id: user.id, slug })
                .first();
            if (existing) {
                return response.status(400).json({
                    error: 'Tag with this name already exists'
                });
            }
            const tagId = (0, uuid_1.v4)();
            const now = Date.now();
            await DB_1.default.table('tags').insert({
                id: tagId,
                user_id: user.id,
                name: name.trim(),
                slug,
                color: color || '#00D9FF',
                description: description || null,
                links_count: 0,
                created_at: now,
                updated_at: now
            });
            const tag = await DB_1.default.from('tags')
                .where('id', tagId)
                .first();
            return response.status(201).json({
                success: true,
                message: 'Tag created successfully',
                data: tag
            });
        }
        catch (error) {
            console.error('Error creating tag:', error);
            return response.status(500).json({
                error: 'Failed to create tag'
            });
        }
    }
    async update(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const tagId = request.params.id;
            const { name, color, description } = await request.json();
            const tag = await DB_1.default.from('tags')
                .where({ id: tagId, user_id: user.id })
                .first();
            if (!tag) {
                return response.status(404).json({
                    error: 'Tag not found'
                });
            }
            const updateData = {
                updated_at: Date.now()
            };
            if (name && name.trim() !== tag.name) {
                const newSlug = generateSlug(name);
                const existing = await DB_1.default.from('tags')
                    .where({ user_id: user.id, slug: newSlug })
                    .whereNot('id', tagId)
                    .first();
                if (existing) {
                    return response.status(400).json({
                        error: 'Tag with this name already exists'
                    });
                }
                updateData.name = name.trim();
                updateData.slug = newSlug;
            }
            if (color !== undefined)
                updateData.color = color;
            if (description !== undefined)
                updateData.description = description;
            await DB_1.default.table('tags')
                .where('id', tagId)
                .update(updateData);
            const updated = await DB_1.default.from('tags')
                .where('id', tagId)
                .first();
            return response.json({
                success: true,
                message: 'Tag updated successfully',
                data: updated
            });
        }
        catch (error) {
            console.error('Error updating tag:', error);
            return response.status(500).json({
                error: 'Failed to update tag'
            });
        }
    }
    async destroy(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const tagId = request.params.id;
            const tag = await DB_1.default.from('tags')
                .where({ id: tagId, user_id: user.id })
                .first();
            if (!tag) {
                return response.status(404).json({
                    error: 'Tag not found'
                });
            }
            await DB_1.default.table('tags')
                .where('id', tagId)
                .delete();
            return response.json({
                success: true,
                message: 'Tag deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting tag:', error);
            return response.status(500).json({
                error: 'Failed to delete tag'
            });
        }
    }
    async attachToLink(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const linkId = request.params.linkId;
            const { tag_ids } = await request.json();
            if (!Array.isArray(tag_ids) || tag_ids.length === 0) {
                return response.status(400).json({
                    error: 'tag_ids must be a non-empty array'
                });
            }
            const link = await DB_1.default.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: 'Link not found'
                });
            }
            const tags = await DB_1.default.from('tags')
                .whereIn('id', tag_ids)
                .where('user_id', user.id);
            if (tags.length !== tag_ids.length) {
                return response.status(400).json({
                    error: 'Some tags not found or do not belong to you'
                });
            }
            const existing = await DB_1.default.from('link_tags')
                .where('link_id', linkId)
                .pluck('tag_id');
            const newTagIds = tag_ids.filter(id => !existing.includes(id));
            if (newTagIds.length === 0) {
                return response.json({
                    success: true,
                    message: 'All tags already attached',
                    attached_count: 0
                });
            }
            const now = Date.now();
            const insertData = newTagIds.map(tagId => ({
                link_id: linkId,
                tag_id: tagId,
                created_at: now
            }));
            await DB_1.default.table('link_tags').insert(insertData);
            for (const tagId of newTagIds) {
                await DB_1.default.raw(`
                    UPDATE tags 
                    SET links_count = (
                        SELECT COUNT(*) FROM link_tags WHERE tag_id = ?
                    )
                    WHERE id = ?
                `, [tagId, tagId]);
            }
            return response.json({
                success: true,
                message: `${newTagIds.length} tag(s) attached successfully`,
                attached_count: newTagIds.length
            });
        }
        catch (error) {
            console.error('Error attaching tags:', error);
            return response.status(500).json({
                error: 'Failed to attach tags'
            });
        }
    }
    async detachFromLink(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const linkId = request.params.linkId;
            const { tag_ids } = await request.json();
            if (!Array.isArray(tag_ids) || tag_ids.length === 0) {
                return response.status(400).json({
                    error: 'tag_ids must be a non-empty array'
                });
            }
            const link = await DB_1.default.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: 'Link not found'
                });
            }
            await DB_1.default.table('link_tags')
                .where('link_id', linkId)
                .whereIn('tag_id', tag_ids)
                .delete();
            for (const tagId of tag_ids) {
                await DB_1.default.raw(`
                    UPDATE tags 
                    SET links_count = (
                        SELECT COUNT(*) FROM link_tags WHERE tag_id = ?
                    )
                    WHERE id = ?
                `, [tagId, tagId]);
            }
            return response.json({
                success: true,
                message: `${tag_ids.length} tag(s) detached successfully`,
                detached_count: tag_ids.length
            });
        }
        catch (error) {
            console.error('Error detaching tags:', error);
            return response.status(500).json({
                error: 'Failed to detach tags'
            });
        }
    }
    async getForLink(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const linkId = request.params.linkId;
            const link = await DB_1.default.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: 'Link not found'
                });
            }
            const tags = await DB_1.default.from('tags')
                .join('link_tags', 'tags.id', 'link_tags.tag_id')
                .where('link_tags.link_id', linkId)
                .select('tags.*');
            return response.json({
                success: true,
                data: tags
            });
        }
        catch (error) {
            console.error('Error fetching link tags:', error);
            return response.status(500).json({
                error: 'Failed to fetch link tags'
            });
        }
    }
}
exports.default = new TagController();
//# sourceMappingURL=TagController.js.map