import { Response, Request } from "../../type";
import DB from "../services/DB";
import { v4 as uuidv4 } from 'uuid';

/**
 * KlikAja - TagController
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Handles tag CRUD operations for organizing links
 */

/**
 * Generate slug from tag name
 */
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/-+/g, '-');      // Replace multiple - with single -
}

class TagController {
    /**
     * List all tags for authenticated user
     * GET /api/tags
     */
    public async index(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            // Get all tags with link count
            const tags = await DB.from('tags')
                .where('user_id', user.id)
                .orderBy('name', 'asc');

            return response.json({
                success: true,
                data: tags
            });
        } catch (error) {
            console.error('Error fetching tags:', error);
            return response.status(500).json({ 
                error: 'Failed to fetch tags' 
            });
        }
    }

    /**
     * Create new tag
     * POST /api/tags
     */
    public async store(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const { name, color, description } = await request.json();

            // Validation
            if (!name || name.trim().length === 0) {
                return response.status(400).json({ 
                    error: 'Tag name is required' 
                });
            }

            const slug = generateSlug(name);

            // Check if tag with this slug already exists for this user
            const existing = await DB.from('tags')
                .where({ user_id: user.id, slug })
                .first();

            if (existing) {
                return response.status(400).json({ 
                    error: 'Tag with this name already exists' 
                });
            }

            // Create tag
            const tagId = uuidv4();
            const now = Date.now();

            await DB.table('tags').insert({
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

            const tag = await DB.from('tags')
                .where('id', tagId)
                .first();

            return response.status(201).json({
                success: true,
                message: 'Tag created successfully',
                data: tag
            });
        } catch (error) {
            console.error('Error creating tag:', error);
            return response.status(500).json({ 
                error: 'Failed to create tag' 
            });
        }
    }

    /**
     * Update tag
     * PUT /api/tags/:id
     */
    public async update(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const tagId = request.params.id;
            const { name, color, description } = await request.json();

            // Check if tag exists and belongs to user
            const tag = await DB.from('tags')
                .where({ id: tagId, user_id: user.id })
                .first();

            if (!tag) {
                return response.status(404).json({ 
                    error: 'Tag not found' 
                });
            }

            // Update data
            const updateData: any = {
                updated_at: Date.now()
            };

            // If name is being changed, update slug and check for duplicates
            if (name && name.trim() !== tag.name) {
                const newSlug = generateSlug(name);
                
                const existing = await DB.from('tags')
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

            if (color !== undefined) updateData.color = color;
            if (description !== undefined) updateData.description = description;

            await DB.table('tags')
                .where('id', tagId)
                .update(updateData);

            const updated = await DB.from('tags')
                .where('id', tagId)
                .first();

            return response.json({
                success: true,
                message: 'Tag updated successfully',
                data: updated
            });
        } catch (error) {
            console.error('Error updating tag:', error);
            return response.status(500).json({ 
                error: 'Failed to update tag' 
            });
        }
    }

    /**
     * Delete tag
     * DELETE /api/tags/:id
     */
    public async destroy(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const tagId = request.params.id;

            // Check if tag exists and belongs to user
            const tag = await DB.from('tags')
                .where({ id: tagId, user_id: user.id })
                .first();

            if (!tag) {
                return response.status(404).json({ 
                    error: 'Tag not found' 
                });
            }

            // Delete tag (CASCADE will remove from link_tags)
            await DB.table('tags')
                .where('id', tagId)
                .delete();

            return response.json({
                success: true,
                message: 'Tag deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting tag:', error);
            return response.status(500).json({ 
                error: 'Failed to delete tag' 
            });
        }
    }

    /**
     * Attach tags to a link
     * POST /api/links/:linkId/tags
     */
    public async attachToLink(request: Request, response: Response) {
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

            // Verify link belongs to user
            const link = await DB.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({ 
                    error: 'Link not found' 
                });
            }

            // Verify all tags belong to user
            const tags = await DB.from('tags')
                .whereIn('id', tag_ids)
                .where('user_id', user.id);

            if (tags.length !== tag_ids.length) {
                return response.status(400).json({ 
                    error: 'Some tags not found or do not belong to you' 
                });
            }

            // Get existing tag associations
            const existing = await DB.from('link_tags')
                .where('link_id', linkId)
                .pluck('tag_id');

            // Filter out already attached tags
            const newTagIds = tag_ids.filter(id => !existing.includes(id));

            if (newTagIds.length === 0) {
                return response.json({
                    success: true,
                    message: 'All tags already attached',
                    attached_count: 0
                });
            }

            // Attach new tags
            const now = Date.now();
            const insertData = newTagIds.map(tagId => ({
                link_id: linkId,
                tag_id: tagId,
                created_at: now
            }));

            await DB.table('link_tags').insert(insertData);

            // Update links_count for each tag
            for (const tagId of newTagIds) {
                await DB.raw(`
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
        } catch (error) {
            console.error('Error attaching tags:', error);
            return response.status(500).json({ 
                error: 'Failed to attach tags' 
            });
        }
    }

    /**
     * Detach tags from a link
     * DELETE /api/links/:linkId/tags
     */
    public async detachFromLink(request: Request, response: Response) {
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

            // Verify link belongs to user
            const link = await DB.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({ 
                    error: 'Link not found' 
                });
            }

            // Detach tags
            await DB.table('link_tags')
                .where('link_id', linkId)
                .whereIn('tag_id', tag_ids)
                .delete();

            // Update links_count for each tag
            for (const tagId of tag_ids) {
                await DB.raw(`
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
        } catch (error) {
            console.error('Error detaching tags:', error);
            return response.status(500).json({ 
                error: 'Failed to detach tags' 
            });
        }
    }

    /**
     * Get tags for a specific link
     * GET /api/links/:linkId/tags
     */
    public async getForLink(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const linkId = request.params.linkId;

            // Verify link belongs to user
            const link = await DB.from('links')
                .where({ id: linkId, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({ 
                    error: 'Link not found' 
                });
            }

            // Get tags for this link
            const tags = await DB.from('tags')
                .join('link_tags', 'tags.id', 'link_tags.tag_id')
                .where('link_tags.link_id', linkId)
                .select('tags.*');

            return response.json({
                success: true,
                data: tags
            });
        } catch (error) {
            console.error('Error fetching link tags:', error);
            return response.status(500).json({ 
                error: 'Failed to fetch link tags' 
            });
        }
    }
}

export default new TagController();
