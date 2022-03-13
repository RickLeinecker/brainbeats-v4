const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { ToggleButtonGroup } = require("react-bootstrap");
const { user, post } = new PrismaClient();

router.get('/:userId', async (req, res) => {

    const { userId } = req.params

    let posts = await post.findMany({
        where: {
            userId: parseInt(userId)
        }, 
        select: {
            title: true,
            createdAt: true,
            post: true,
            user: true,
        }
    });

    res.send(posts);
})

router.post('/', async (req, res) => {
    const { title, content, userId } =  req.body

    const userExists = await user.findUnique({
        where: {
            id: userId
        }
    });

    if(!userExists) {
        return res.status(400).json({
            msg: "User not found"
        })
    }

    const newPost = await post.create({
        data: {
            title,
            post: content, 
            userId
        }
    })
    res.json(newPost)

});

module.exports = router