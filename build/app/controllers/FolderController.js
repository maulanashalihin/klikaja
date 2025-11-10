"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const uuid_1 = require("uuid");
class FolderController {
    async index(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const folders = await DB_1.default.from('folders')
                .select('folders.*', DB_1.default.raw('COUNT(links.id) as links_count'))
                .leftJoin('links', 'folders.id', 'links.folder_id')
                .where('folders.user_id', user.id)
                .groupBy('folders.id')
                .orderBy('folders.position', 'asc')
                .orderBy('folders.created_at', 'desc');
            return response.json({
                success: true,
                data: folders
            });
        }
        catch (error) {
            console.error('Error fetching folders:', error);
            return response.status(500).json({
                error: 'Failed to fetch folders'
            });
        }
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const { name, color, icon, description } = await request.json();
            if (!name || name.trim().length === 0) {
                return response.status(400).json({
                    error: 'Folder name is required'
                });
            }
            const existing = await DB_1.default.from('folders')
                .where({ user_id: user.id, name: name.trim() })
                .first();
            if (existing) {
                return response.status(400).json({
                    error: 'Folder with this name already exists'
                });
            }
            const maxPosition = await DB_1.default.from('folders')
                .where('user_id', user.id)
                .max('position as max')
                .first();
            const newPosition = (maxPosition?.max || 0) + 1;
            const folderId = (0, uuid_1.v4)();
            const now = Date.now();
            await DB_1.default.table('folders').insert({
                id: folderId,
                user_id: user.id,
                name: name.trim(),
                color: color || '#FF6B35',
                icon: icon || 'folder',
                description: description || null,
                position: newPosition,
                created_at: now,
                updated_at: now
            });
            const folder = await DB_1.default.from('folders')
                .where('id', folderId)
                .first();
            return response.status(201).json({
                success: true,
                message: 'Folder created successfully',
                data: folder
            });
        }
        catch (error) {
            console.error('Error creating folder:', error);
            return response.status(500).json({
                error: 'Failed to create folder'
            });
        }
    }
    async update(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const folderId = request.params.id;
            const { name, color, icon, description, position } = await request.json();
            const folder = await DB_1.default.from('folders')
                .where({ id: folderId, user_id: user.id })
                .first();
            if (!folder) {
                return response.status(404).json({
                    error: 'Folder not found'
                });
            }
            if (name && name.trim() !== folder.name) {
                const existing = await DB_1.default.from('folders')
                    .where({ user_id: user.id, name: name.trim() })
                    .whereNot('id', folderId)
                    .first();
                if (existing) {
                    return response.status(400).json({
                        error: 'Folder with this name already exists'
                    });
                }
            }
            const updateData = {
                updated_at: Date.now()
            };
            if (name !== undefined)
                updateData.name = name.trim();
            if (color !== undefined)
                updateData.color = color;
            if (icon !== undefined)
                updateData.icon = icon;
            if (description !== undefined)
                updateData.description = description;
            if (position !== undefined)
                updateData.position = position;
            await DB_1.default.table('folders')
                .where('id', folderId)
                .update(updateData);
            const updated = await DB_1.default.from('folders')
                .where('id', folderId)
                .first();
            return response.json({
                success: true,
                message: 'Folder updated successfully',
                data: updated
            });
        }
        catch (error) {
            console.error('Error updating folder:', error);
            return response.status(500).json({
                error: 'Failed to update folder'
            });
        }
    }
    async destroy(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const folderId = request.params.id;
            const folder = await DB_1.default.from('folders')
                .where({ id: folderId, user_id: user.id })
                .first();
            if (!folder) {
                return response.status(404).json({
                    error: 'Folder not found'
                });
            }
            const linksCount = await DB_1.default.from('links')
                .where('folder_id', folderId)
                .count('id as count')
                .first();
            await DB_1.default.table('links')
                .where('folder_id', folderId)
                .update({ folder_id: null });
            await DB_1.default.table('folders')
                .where('id', folderId)
                .delete();
            return response.json({
                success: true,
                message: 'Folder deleted successfully',
                links_moved: linksCount?.count || 0
            });
        }
        catch (error) {
            console.error('Error deleting folder:', error);
            return response.status(500).json({
                error: 'Failed to delete folder'
            });
        }
    }
    async moveLinks(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const folderId = request.params.id;
            const { link_ids } = await request.json();
            if (!Array.isArray(link_ids) || link_ids.length === 0) {
                return response.status(400).json({
                    error: 'link_ids must be a non-empty array'
                });
            }
            if (folderId !== 'null') {
                const folder = await DB_1.default.from('folders')
                    .where({ id: folderId, user_id: user.id })
                    .first();
                if (!folder) {
                    return response.status(404).json({
                        error: 'Folder not found'
                    });
                }
            }
            const links = await DB_1.default.from('links')
                .whereIn('id', link_ids)
                .where('user_id', user.id);
            if (links.length !== link_ids.length) {
                return response.status(400).json({
                    error: 'Some links not found or do not belong to you'
                });
            }
            await DB_1.default.table('links')
                .whereIn('id', link_ids)
                .update({
                folder_id: folderId === 'null' ? null : folderId,
                updated_at: Date.now()
            });
            return response.json({
                success: true,
                message: `${link_ids.length} link(s) moved successfully`,
                moved_count: link_ids.length
            });
        }
        catch (error) {
            console.error('Error moving links:', error);
            return response.status(500).json({
                error: 'Failed to move links'
            });
        }
    }
    async reorder(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }
            const { folder_ids } = await request.json();
            if (!Array.isArray(folder_ids) || folder_ids.length === 0) {
                return response.status(400).json({
                    error: 'folder_ids must be a non-empty array'
                });
            }
            const folders = await DB_1.default.from('folders')
                .whereIn('id', folder_ids)
                .where('user_id', user.id);
            if (folders.length !== folder_ids.length) {
                return response.status(400).json({
                    error: 'Some folders not found or do not belong to you'
                });
            }
            const now = Date.now();
            for (let i = 0; i < folder_ids.length; i++) {
                await DB_1.default.table('folders')
                    .where('id', folder_ids[i])
                    .update({
                    position: i + 1,
                    updated_at: now
                });
            }
            return response.json({
                success: true,
                message: 'Folders reordered successfully'
            });
        }
        catch (error) {
            console.error('Error reordering folders:', error);
            return response.status(500).json({
                error: 'Failed to reorder folders'
            });
        }
    }
}
exports.default = new FolderController();
//# sourceMappingURL=FolderController.js.map