import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";


export default function App() {
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [droppedItem, setDroppedItem] = useState(null);
  const [rotation, setRotation] = useState(0)
  const [rotationRight, setRotationRight] = useState(0)
  const [showHello, setShowHello] = useState(false)
  const [showMessage, setShowMessage] = useState('')
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // const handleMove = (steps) => {
  //   setCatPosition((prevPosition) => ({ x: prevPosition.x + steps }));
  // };
  const handleMove = ({ x, y }) => {
    setCatPosition((prevPosition) => ({ x: prevPosition.x + x, y: prevPosition.y + y }));
  };
  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation + 15);
  };
  const handleRightRotate = () => {
    setRotationRight((prevRotation) => prevRotation - 15)
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (droppedItem) => {
    setDroppedItem(droppedItem);
  };

  async function handleSayHello(message) {
  const specialMessages = message;

  const displayMessages = async (messages, index) => {
    if (index < messages.length) {
      const msg = messages[index];
      if (msg !== null && msg !== undefined) {
        setShowMessage(msg);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await displayMessages(messages, index + 1);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowHello(false);
      setShowMessage('');
    }
  };

  if (specialMessages && Array.isArray(message)) {
    const messagesToDisplay = message.filter(msg => msg !== null && msg !== undefined);

    setShowHello(true);
    await displayMessages(messagesToDisplay, 0);
  } else if (typeof message === 'string') {
    setShowHello(true);
    setShowMessage(message);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowHello(false);
    setShowMessage('');
  }
}

  
  const handleGoToXY = (coordinates) => {
    setCatPosition({ x: coordinates.x, y: coordinates.y });
  };
 
  
  const getRandomPosition = () => {
    const maxX = screenWidth - 50;
    const maxY = screenHeight - 50; 
  
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
  
    return { x: newX, y: newY };
  };
  
  const handleGoToRandomPosition = () => {
    const randomPosition = getRandomPosition();
    const boundedX = Math.min(screenWidth - 50, Math.max(0, randomPosition.x));
    const boundedY = Math.min(screenHeight - 50, Math.max(0, randomPosition.y));
    setCatPosition({ x: boundedX, y: boundedY });
  };
  
  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
           onMove={handleMove} 
          onleftRotate={handleRotate} 
          onRightRotate={handleRightRotate} 
          handleSayHello={handleSayHello} 
          showHello={showHello} 
          setShowHello={setShowHello} 
          // onGoToXY={handleGoToXY}
          onGoToXY={handleGoToXY}
          onGoToRandomPosition={handleGoToRandomPosition}
          />
          <MidArea onDrop={handleDrop}
           onDragOver={handleDragOver} 
           onMove={handleMove} 
           onleftRotate={handleRotate}
            onRightRotate={handleRightRotate}
             handleSayHello={handleSayHello} 
             onGoToXY={handleGoToXY}
             onGoToRandomPosition={handleGoToRandomPosition}
              />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
           onMove={catPosition}
            onleftRotate={rotation} 
            onRightRotate={rotationRight}
            handleSayHello={handleSayHello}
             showHello={showHello}
              setShowHello={setShowHello} 
              message={showMessage}
              catPosition={catPosition}
              setCatPosition = {setCatPosition} />
        </div>
      </div>
    </div>
  );
}
