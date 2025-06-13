const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs[0].likes === undefined) {
        return 0
    }
    if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        return blogs.map((b) => b.likes).reduce((a, b) => a + b)
    }
}

const favoriteBlog = (blogs) => {
    if (blogs[0].likes === undefined) {
        return 0
    }
    if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        var mostLikes = blogs[0]

        for (var i = 0; i < blogs.length; i++) {
            if (blogs[i].likes > mostLikes.likes) {
                mostLikes = blogs[i]
            }
        }
        return mostLikes.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs[0].author === undefined) {
        return null
    }
    if (blogs.length === 1) {
        return {
            author: blogs[0].author,
            blogs: 1
        }
    } else {
        const counts = lodash.countBy(blogs, 'author')
        const authorWithMostBlogs = lodash.maxBy(Object.keys(counts), author => counts[author])
        return {
            author: authorWithMostBlogs,
            blogs: counts[authorWithMostBlogs]
        }
    }
}

const mostLikes = (blogs) => {
    if (blogs[0].author === undefined) {
        return null
    }
    if (blogs.length === 1) {
        return {
            author: blogs[0].author,
            likes: blogs[0].likes
        }
    } else {
    const groupedAuthors = lodash.groupBy(blogs, 'author')

    const authorLikes = lodash.map(groupedAuthors, (blogs, author) => ({
        author,
        likes: lodash.sumBy(blogs, 'likes')
    }))
    return lodash.maxBy(authorLikes, 'likes')
}
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}


