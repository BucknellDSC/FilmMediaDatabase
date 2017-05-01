export const STOP_WORDS = ["a", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren\'t",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can\'t", "cannot",
    "could", "couldn\'t", "did", "didn\'t", "do", "does", "doesn\'t", "doing", "don\'t", "down", "during", "each",
    "few", "for", "from", "further", "had", "hadn\'t", "has", "hasn\'t", "have", "haven\'t", "having", "he",
    "he\'d", "he\'ll", "he\'s", "her", "here", "here\'s", "hers", "herself", "him", "himself", "his", "how",
    "how\'s", "i", "i\'d", "i\'ll", "i\'m", "i\'ve", "if", "in", "into", "is", "isn\'t", "it", "it\'s", "its",
    "itself", "let\'s", "me", "more", "most", "mustn\'t", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan\'t",
    "she", "she\'d", "she\'ll", "she\'s", "should", "shouldn\'t", "so", "some", "such", "than", "that", "that\'s",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there\'s", "these", "they", "they\'d",
    "they\'ll", "they\'re", "they\'ve", "this", "those", "through", "to", "too", "under", "until", "up", "very",
    "was", "wasn\'t", "we", "we\'d", "we\'ll", "we\'re", "we\'ve", "were", "weren\'t", "what", "what\'s", "when",
    "when\'s", "where", "where\'s", "which", "while", "who", "who\'s", "whom", "why", "why\'s", "with", "won\'t",
    "would", "wouldn\'t", "you", "you\'d", "you\'ll", "you\'re", "you\'ve", "your", "yours", "yourself", "yourselves"];

export const GENRES = ["All", "Action", "Thriller", "Comedy", "Family", "Adventure", "Mystery", "Romance", "Sci-Fi",
    "Horror", "Drama", "Biography", "Fantasy", "Crime", "War", "Animation", "History", "Musical"];


/**
 * Converts a timestamp to a scaled horizontal offset for the vertical bar in the timeline.
 *
 * @param movieStartTimeStamp A timestamp of a line of dialogue in the format hours:minutes:seconds,milliseconds
 * @param totalMovieRuntime The total runtime of the film, in minutes
 * @return {number} The horizontal offset in pixels
 */
export function timeStampToMinutes(movieStartTimeStamp, totalMovieRuntime) {
    // Horizontal length of the timeline in the metadata drawer (in pixels)
    const timeLineLength = 200;

    const splitString = movieStartTimeStamp.split(":");
    return Math.ceil((10 + parseInt(splitString[0]) * 60 + parseInt(splitString[1]))/totalMovieRuntime*timeLineLength);
}


/**
 * Removes milliseconds in a screenshot's timestamp
 *
 * @param movieStartTimeStamp A timestamp of a line of dialogue in the format hours:minutes:seconds,milliseconds
 * @return {*}  A timestamp of a line of dialogue in the format hours:minutes:seconds
 */
export function beautifyTimeStamp(movieStartTimeStamp) {
    const splitString = movieStartTimeStamp.split(",");
    return (splitString[0]);
}


export function relevanceSort(a, b) {
    if (a.results.length > b.results.length) {
        return -1;
    }
    else if (a.results.length < b.results.length) {
        return 1;
    }
    else {
        return 0;
    }
}

export function alphabeticalSort(a, b) {
    return a.movieTitle.localeCompare(b.movieTitle);
}

export function yearSort(a, b) {
    if (a.movieReleaseYear > b.movieReleaseYear) {
        return -1;
    }
    else if (a.movieReleaseYear < b.movieReleaseYear) {
        return 1;
    }
    else {
        return 0;
    }
}

