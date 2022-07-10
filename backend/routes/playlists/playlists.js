require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { user, post } = new PrismaClient();
// const { JSON } = require("express");

// Create a new playlist
router.post('/createPlaylist', async (req, res) => {

    try {
        const { name, userID } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { userID }
        });

        if (!userExists) {
            return res.status(400).json({
                msg: "User not found"
            })
        } else {

            const newPlaylist = await prisma.playlist.create({
                data: {
                    name: name,
                    userID: userID,
                    user: userExists
                }
            });

            res.json(newPlaylist);
        }
    } catch (err) {
        res.status(500).send({ msg: err })
    }

});


// Get all playlists
router.get('/getAllPlaylists', async (req, res) => {

    try {
        const playlists = await prisma.playlist.findMany();
        res.json(playlists);
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get playlist by ID
router.get('/getPlaylistByID', async (req, res) => {
    try {
        const playlist = await prisma.playlist.findUnique({
            where: { id: req.body.id }
        });

        if (!playlist) {
            return res.status(400).json({
                msg: "Playlist does not exist."
            });
        }

        res.json(playlist);
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
});

// Get all playlists for a post by post ID
router.get('/getPlaylistsByPostID', async (req, res) => {

    try {
        const playlists = await prisma.playlistpost.findMany({
            where: { postID: req.body.postID },
            distinct: ['playlistID']
        });

        if (!playlists) {
            return res.status(400).json({
                msg: "Post does not exist"
            })
        }
        res.json(playlist)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get all posts in a playlist
router.get('/getPostsByPlaylistID', async (req, res) => {
    try {
        const playlist = await prisma.playlist.findUnique({
            where: { id: req.body.id }
        });

        if (!playlist) {
            return res.status(400).json({
                msg: "Playlist does not exist."
            });
        } else {
            const posts = await prisma.playlistpost.findMany({
                where: { playlistID: req.body.id }
            });

            res.json(posts);
        }

        res.json(playlist);
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
});

// Delete a playlist
router.delete('/deletePlaylist', async (req, res) => {

    try {
        const deletePlaylist = await prisma.playlist.delete({
            where: { id: req.body.id }
        })
        res.status(200).send({ msg: "Deleted a user playlist" });
    }
    catch (err) {
        res.status(500).send(err);
    }

});


// TODO : Update a playlist
router.put('/updateUser', async (req, res) => {

    try {
        const { id, firstName, lastName, dob, email, username, bio, profilePicture } = req.body
        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                bio: bio,
                profilePicture: profilePicture
            }
        })
        //   res.status(200).send({msg: "Updated OK"});
        res.json(updateUser);
    }

    catch (err) {
        res.status(500).send(err);
    }

});

module.exports = router;