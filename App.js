import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity, Button, PanResponder, Dimensions } from 'react-native';

export default function App() {
  const [pieceVisible, setPieceVisible] = useState(true);
  const [puzzleComplete,setPuzzleComplete] = useState(false);
  const [showCompletion, setCompletionPic] = useState(false);
  const [arrow,setMyArrow] = useState(false);
 
  const isPuzzleComplete = () => {
    return piecesState.every(piece => piece.isSnapped);
  };

  const pieces = [
    { name: 'JohnTopLeft', position: { x: 300, y: 350 }, target: { x: 1.5, y: 4 }, isSnapped: false  },
    { name: 'JohnTopCenter', position: { x: 200, y: 300 }, target: { x: 151, y: 3.5 }, isSnapped: false  },
    { name: 'JohnTopRight', position: { x: 10, y: 200 }, target: { x: 241, y: 0 }, isSnapped: false  },
    { name: 'JohnMiddleLeft', position: { x: 300, y: -200 }, target: { x: 1.3, y: 104 }, isSnapped: false },
    { name: 'JohnCenter', position: { x: 30, y: 320 }, target: { x: 98, y: 148 }, isSnapped: false },
    { name: 'JohnMiddleRight', position: { x: 0, y: 0 }, target: { x: 294, y: 107 }, isSnapped: false },
    { name: 'JohnBottomLeft', position: { x: 250, y: 30 }, target: { x: 4, y: 252 }, isSnapped: false },
    { name: 'JohnBottomCenter', position: { x: 200, y: -100 }, target: { x: 151, y: 249 }, isSnapped: false },
    { name: 'JohnBottomRight', position: { x: 50, y: -200 }, target: { x: 243, y: 249 }, isSnapped: false },
  ];

  const imageMap = {
    JohnTopLeft: require('./assets/puzzle-images/JohnTopLeft.png'),
    JohnTopCenter: require('./assets/puzzle-images/JohnTopCenter.png'),
    JohnTopRight: require('./assets/puzzle-images/JohnTopRight.png'),
    JohnMiddleLeft: require('./assets/puzzle-images/JohnMiddleLeft.png'),
    JohnCenter: require('./assets/puzzle-images/JohnCenter.png'),
    JohnMiddleRight: require('./assets/puzzle-images/JohnMiddleRight.png'),
    JohnBottomLeft: require('./assets/puzzle-images/JohnBottomLeft.png'),
    JohnBottomCenter: require('./assets/puzzle-images/JohnBottomCenter.png'),
    JohnBottomRight: require('./assets/puzzle-images/JohnBottomRight.png'),
  };

  const completionImage = require('./assets/puzzle-images/JohnFoundIt.png');

  const [piecesState, setPieces] = useState(pieces);

  const createPanResponder = (index) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !piecesState[index].isSnapped,
      onPanResponderMove: (evt, gestureState) => {
        setPieces((prev) => {
          const updatedPieces = [...prev];
          updatedPieces[index].position.x += gestureState.dx;
          updatedPieces[index].position.y += gestureState.dy;
          return updatedPieces;
        });
      },
      onPanResponderRelease: () => {
        setPieces((prev) => {
          const updatedPieces = [...prev];
          const piece = updatedPieces[index];
          const target = piece.target;

          // Calculate the distance
          if (target) { // Check if target is defined
            // Calculate the distance
            const distance = Math.sqrt(
              Math.pow(piece.position.x - target.x, 2) +
              Math.pow(piece.position.y - target.y, 2)
            );

            const threshold = 20; // Define how close to snap (in pixels)

            // Snap to target if within threshold
            if (distance < threshold) {
              piece.position = { x: target.x, y: target.y }; // Snap to target position
              piece.isSnapped = true;
            }
          } else {
            console.warn(`Target for piece ${piece.name} is not defined.`);
          }

          // Log the position after dragging
          console.log(`${piece.name} position after drag:`, piece.position);

          if (isPuzzleComplete()) {
            setPuzzleComplete(true);
            setCompletionPic(true);
            console.log("Puzzle is complete!");
          }
          return updatedPieces;
        });
      },
    });
  };

  const test = () => {
    setPieceVisible(!pieceVisible);
    console.log("Piece visibility changed:", !pieceVisible);
  };

  const puzzleBorder = require('./assets/puzzle-images/JohnPuzzleBorder.png');

  return (
    <ImageBackground
      source={require('./assets/puzzle-images/greatwallJohn.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.innerContainer}>
        {pieceVisible &&  !arrow && (
          <TouchableOpacity onPress={test}>
            <Image 
              source={require('./assets/puzzle-images/puzzlePieces.png')}
              style={[styles.puzzlePiece, { zIndex: 2 }]}
            />
          </TouchableOpacity>
        )}

        {arrow && (
          <TouchableOpacity>
            <Image
            source = {require('./assets/puzzle-images/arrowRight.png')}
            style = {styles.arrowRight}
            />            
          </TouchableOpacity>
        )}

        {!pieceVisible && !arrow &&(
          <View>
            <Image source={puzzleBorder} />
            
            {piecesState
            .sort((a, b) => (b.isSnapped ? 1 : 0) - (a.isSnapped ? 1 : 0))
            .map((piece, index) => (
              <Image 
              key={piece.name}
              source={imageMap[piece.name]}
              style={[{ position: 'absolute', top: piece.position.y, left: piece.position.x, zIndex: piece.isSnapped ? 0 : 1 }]}
              {...createPanResponder(index).panHandlers}
              />
            ))}

            {showCompletion && (
              <Image 
                source={completionImage}
                style={styles.completionImage} // Define styles for this image
              />
            )}

            <Button
              title="Close Puzzle"
              onPress={() => {
                test(); // Toggle piece visibility
                setCompletionPic(false); // Hide the completion image
                if(puzzleComplete==true){
                  setMyArrow(true);
                }
              }}
            />
          </View>
        )}

       
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puzzlePiece: {
    height: 40,
    width: 40,
    position: 'absolute',
    top: 50,
    left: 175,
  },
  completionImage: {
    width: 845, // Set the width according to your requirement
    height: 740, // Set the height according to your requirement
    position: 'absolute',
     top: -20, // Adjust as needed
    // left: 50, // Adjust as needed
    zIndex: 3, // Make sure it's on top of other components
  },
  arrowRight: {
    left: 180,
    width: 30,
    height: 30
  }
});
