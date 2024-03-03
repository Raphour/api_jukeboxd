export default class Rating {
  get grade() {
    return this._grade;
  }

  set grade(value) {
    this._grade = value;
  }

  get review() {
    return this._review;
  }

  
    constructor(obj) {
      // Extract and validate properties
      const { id, grade, review, contentId, userId } = obj;
  
      if (!id || typeof id !== 'number') {
        throw new TypeError('Invalid id: must be a number');
      }
  
      if (!grade || typeof grade !== 'number' || grade < 0 || grade > 5) {
        throw new TypeError('Invalid grade: must be a number between 0 and 5');
      }
  
      if ( typeof review !== 'string') {
        throw new TypeError('Invalid review: must be a string');
      }
  
      if (!typeOfContent || typeof typeOfContent !== 'string' || (typeOfContent !== 'song' && typeOfContent !== 'album')) {
        throw new TypeError('Invalid typeOfContent: must be "song" or "album"');
      }
  
      // Store validated data in properties
      this.id = id;
      this._grade = grade;
      this._review = review || null;
      this._typeOfContent = typeOfContent;
      this._contentId = contentId;
      this._userId = userId; 
    }


  }
  