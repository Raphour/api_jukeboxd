export default class Rating {

  constructor(obj) {
    // Extract and validate properties
    const { id, grade,timestamp, review, contentId, username, typeOfContent } = obj;


    if (!Number.isInteger(grade) || grade < 0 || grade > 5) {
      console.log(grade);
      console.log(!Number.isInteger(grade));
      console.log(grade < 0);
      console.log(grade > 5);

      throw new TypeError('Invalid grade: must be a number between 0 and 5');
    }

    if (typeof review !== 'string') {
      throw new TypeError('Invalid review: must be a string');
    }

    console.log(typeOfContent)
    console.log(typeof typeOfContent)

    if (!typeOfContent || typeof typeOfContent !== 'string' || (typeOfContent !== 'track' && typeOfContent !== 'album')) {
      throw new TypeError('Invalid typeOfContent: must be "track" or "album"');
    }

    // Store validated data in properties

    this.grade = grade;
    this.review = review || null;
    this.typeOfContent = typeOfContent;
    this.contentId = contentId;
    this.username  = username;
    //srt timestamp to the current date
    this.timestamp = new Date();
    this.id = id
  }


}
