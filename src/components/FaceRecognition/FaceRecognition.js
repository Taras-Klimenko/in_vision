import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="image" src={imageURL} alt="" width="500px" height="auto" />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightColumn,
            bottom: box.bottomRow,
            left: box.leftColumn,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
