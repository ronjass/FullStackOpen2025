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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}


