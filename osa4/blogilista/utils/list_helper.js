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
  
module.exports = {
    dummy,
    totalLikes
}


