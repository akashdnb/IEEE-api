const Event = require('../models/eventModel');
const cloudinary = require('../cloudinary/cloudinaryConfig')

const postEvent = async (req, res) => {
    try {
        const event = new Event({
            title: req.body.title,
            summary: req.body.summary,
            body: req.body.body,
            images: req.body.images,
            author: req.body.author,
            location: req.body.location,
            admin: req.admin.email
        })
        const savedEvent = await event.save();
        res.status(200).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const getEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchText = req.query.title? req.query.title : ' ';
    const query = searchText != 'undefined' ? { title: { $regex: searchText, $options: 'i' } } : {};

    try {
        const events = await Event.find(query)
            .select('_id title summary body images date location eventDate author')
            .skip(startIndex)
            .limit(limit)
            .sort({ _id: -1 });
        const total = await Event.countDocuments();

        const pagination = {
            total: total
        };
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            };
        }

        res.status(200).json({
            events: events,
            pagination: pagination
        });
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const publicIds = event.images.map(url => extractPublicIdFromUrl(url)).filter(Boolean);

        await cloudinary.api
            .delete_resources(publicIds, { type: 'upload', resource_type: 'image' });

        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({message: 'event deleted', deletedEvent});
    } catch (err) {
        console.error(`Error deleting event: ${err.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const updateEvent = async (req, res) => {
    try {
        const updateFields = {};

        if (req.body.title) {
            updateFields.title = req.body.title;
        }

        if (req.body.summary) {
            updateFields.summary = req.body.summary;
        }

        if (req.body.body) {
            updateFields.body = req.body.body;
        }

        if (req.body.location) {
            updateFields.location = req.body.location;
        }

        if (req.body.author) {
            updateFields.author = req.body.author;
        }

        updateFields.admin = req.admin.email;

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const extractPublicIdFromUrl = (url) => {
    if (url) {
        const parts = url.split('/');
        const publicIdWithExtension = parts[parts.length - 1];

        if (publicIdWithExtension.includes('.')) {
            const filename = publicIdWithExtension.split('.')[0];

            const foldername = parts[parts.length - 2];
            const publicId = `${foldername}/${filename}`;

            return publicId;
        }
    }
    return null;
};



module.exports = {
    postEvent,
    getEvents,
    getEventById,
    deleteEvent,
    updateEvent
}