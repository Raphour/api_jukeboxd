export default class Rating {
  //add timestamp attribute to the rating

  get grade() {
    return this.grade;
  }

  set grade(value) {
    this.grade = value;
  }

  get review() {
    return this.review;
  }



  
    constructor(obj) {
      // Extract and validate properties
      const {  grade, review, contentId, userId, typeOfContent } = obj;
  
  
      if ( !Number.isInteger(grade) || grade < 0 || grade > 5) {
        console.log(grade);
        console.log(!Number.isInteger(grade));
        console.log(grade < 0);
        console.log(grade > 5);

        throw new TypeError('Invalid grade: must be a number between 0 and 5');
      }
  
      if ( typeof review !== 'string') {
        throw new TypeError('Invalid review: must be a string');
      }
  
      if (!typeOfContent || typeof typeOfContent !== 'string' || (typeOfContent !== 'song' && typeOfContent !== 'album')) {
        throw new TypeError('Invalid typeOfContent: must be "track" or "album"');
      }
  
      // Store validated data in properties
 
      this.grade = grade;
      this.review = review || null;
      this.typeOfContent = typeOfContent;
      this.contentId = contentId;
      this.userId = userId; 
      //srt timestamp to the current date
      this.timestamp = new Date();
    }


  }
  