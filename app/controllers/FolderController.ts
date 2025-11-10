import { Response, Request } from "../../type";
import DB from "../services/DB";
import { v4 as uuidv4 } from 'uuid';

/**
 * KlikAja - FolderController
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Handles folder CRUD operations for organizing links
 */

class FolderController {
    /**
     * List all folders for authenticated user
     * GET /api/folders
     */
    public async index(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            // Get all folders with link count
            const folders = await DB.from('folders')
                .select(
                    'folders.*',
                    DB.raw('COUNT(links.id) as links_count')
                )
                .leftJoin('links', 'folders.id', 'links.folder_id')
                .where('folders.user_id', user.id)
                .groupBy('folders.id')
                .orderBy('folders.position', 'asc')
                .orderBy('folders.created_at', 'desc');

            return response.json({
                success: true,
                data: folders
            });
        } catch (error) {
            console.error('Error fetching folders:', error);
            return response.status(500).json({ 
                error: 'Failed to fetch folders' 
            });
        }
    }

    /**
     * Create new folder
     * POST /api/folders
     */
    public async store(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const { name, color, icon, description } = await request.json();

            // Validation
            if (!name || name.trim().length === 0) {
                return response.status(400).json({ 
                    error: 'Folder name is required' 
                });
            }

            // Check if folder name already exists for this user
            const existing = await DB.from('folders')
                .where({ user_id: user.id, name: name.trim() })
                .first();

            if (existing) {
                return response.status(400).json({ 
                    error: 'Folder with this name already exists' 
                });
            }

            // Get max position for ordering
            const maxPosition = await DB.from('folders')
                .where('user_id', user.id)
                .max('position as max')
                .first();

            const newPosition = (maxPosition?.max || 0) + 1;

            // Create folder
            const folderId = uuidv4();
            const now = Date.now();

            await DB.table('folders').insert({
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

            const folder = await DB.from('folders')
                .where('id', folderId)
                .first();

            return response.status(201).json({
                success: true,
                message: 'Folder created successfully',
                data: folder
            });
        } catch (error) {
            console.error('Error creating folder:', error);
            return response.status(500).json({ 
                error: 'Failed to create folder' 
            });
        }
    }

    /**
     * Update folder
     * PUT /api/folders/:id
     */
    public async update(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const folderId = request.params.id;
            const { name, color, icon, description, position } = await request.json();

            // Check if folder exists and belongs to user
            const folder = await DB.from('folders')
                .where({ id: folderId, user_id: user.id })
                .first();

            if (!folder) {
                return response.status(404).json({ 
                    error: 'Folder not found' 
                });
            }

            // If name is being changed, check for duplicates
            if (name && name.trim() !== folder.name) {
                const existing = await DB.from('folders')
                    .where({ user_id: user.id, name: name.trim() })
                    .whereNot('id', folderId)
                    .first();

                if (existing) {
                    return response.status(400).json({ 
                        error: 'Folder with this name already exists' 
                    });
                }
            }

            // Update folder
            const updateData: any = {
                updated_at: Date.now()
            };

            if (name !== undefined) updateData.name = name.trim();
            if (color !== undefined) updateData.color = color;
            if (icon !== undefined) updateData.icon = icon;
            if (description !== undefined) updateData.description = description;
            if (position !== undefined) updateData.position = position;

            await DB.table('folders')
                .where('id', folderId)
                .update(updateData);

            const updated = await DB.from('folders')
                .where('id', folderId)
                .first();

            return response.json({
                success: true,
                message: 'Folder updated successfully',
                data: updated
            });
        } catch (error) {
            console.error('Error updating folder:', error);
            return response.status(500).json({ 
                error: 'Failed to update folder' 
            });
        }
    }

    /**
     * Delete folder
     * DELETE /api/folders/:id
     */
    public async destroy(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const folderId = request.params.id;

            // Check if folder exists and belongs to user
            const folder = await DB.from('folders')
                .where({ id: folderId, user_id: user.id })
                .first();

            if (!folder) {
                return response.status(404).json({ 
                    error: 'Folder not found' 
                });
            }

            // Get links in this folder
            const linksCount = await DB.from('links')
                .where('folder_id', folderId)
                .count('id as count')
                .first();

            // Set folder_id to null for all links in this folder
            // (CASCADE is set to SET NULL in migration)
            await DB.table('links')
                .where('folder_id', folderId)
                .update({ folder_id: null });

            // Delete folder
            await DB.table('folders')
                .where('id', folderId)
                .delete();

            return response.json({
                success: true,
                message: 'Folder deleted successfully',
                links_moved: linksCount?.count || 0
            });
        } catch (error) {
            console.error('Error deleting folder:', error);
            return response.status(500).json({ 
                error: 'Failed to delete folder' 
            });
        }
    }

    /**
     * Move links to folder
     * POST /api/folders/:id/move-links
     */
    public async moveLinks(request: Request, response: Response) {
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

            // Check if folder exists and belongs to user (null means "no folder")
            if (folderId !== 'null') {
                const folder = await DB.from('folders')
                    .where({ id: folderId, user_id: user.id })
                    .first();

                if (!folder) {
                    return response.status(404).json({ 
                        error: 'Folder not found' 
                    });
                }
            }

            // Verify all links belong to user
            const links = await DB.from('links')
                .whereIn('id', link_ids)
                .where('user_id', user.id);

            if (links.length !== link_ids.length) {
                return response.status(400).json({ 
                    error: 'Some links not found or do not belong to you' 
                });
            }

            // Move links to folder
            await DB.table('links')
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
        } catch (error) {
            console.error('Error moving links:', error);
            return response.status(500).json({ 
                error: 'Failed to move links' 
            });
        }
    }

    /**
     * Reorder folders
     * POST /api/folders/reorder
     */
    public async reorder(request: Request, response: Response) {
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

            // Verify all folders belong to user
            const folders = await DB.from('folders')
                .whereIn('id', folder_ids)
                .where('user_id', user.id);

            if (folders.length !== folder_ids.length) {
                return response.status(400).json({ 
                    error: 'Some folders not found or do not belong to you' 
                });
            }

            // Update positions
            const now = Date.now();
            for (let i = 0; i < folder_ids.length; i++) {
                await DB.table('folders')
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
        } catch (error) {
            console.error('Error reordering folders:', error);
            return response.status(500).json({ 
                error: 'Failed to reorder folders' 
            });
        }
    }
}

export default new FolderController();
