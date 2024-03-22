
import React, { useState } from "react";
import Icon from "./Icon";


export default function MidArea({ onDrop, onDragOver,onMove,onleftRotate,onRightRotate,handleSayHello ,onGoToXY,onGoToRandomPosition}) {
  const [droppedItems, setDroppedItems] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [rotationRight, setRotationRight] = useState(0);

  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [enteredNumber, setEnteredNumber] = useState("");
  const [enteredNumbery, setEnteredNumbery] = useState("");
  const [sayText, setSayText] = useState(""); 
  const [sayTexts, setSayTexts] = useState([]);


  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const handleInputChange = (event) => {
    const value = event.target.value;
    // console.log("value",value)
    setEnteredNumber(value);
  };
  const handleInputChangey=(event) => {
    const value = event.target.value;
    // console.log("value",value)
    setEnteredNumbery(value);
  };
  const handleInputChangeSayText1 = (event) => {
    const value = event.target.value;
    setSayText(value);
  };
  const handleInputChangeSayText = (event, index) => {
    const value = event.target.value;

    // Update the specific "Custome" item's text
    setSayTexts((prevSayTexts) => {
      const updatedSayTexts = [...prevSayTexts];
      updatedSayTexts[index] = value;
      return updatedSayTexts;
    });
  };
  const handleGoToXY = (coordinates) => {
    // console.log("corodinates in midraer",enteredNumber,enteredNumbery)
   const x= parseInt(enteredNumber);
   const y=parseInt(enteredNumbery)  ;
   if (!isNaN(x) && !isNaN(y)) {
    const coordinates = { x, y };
    // console.log("coordinates", coordinates);
    onGoToXY(coordinates);
  }
  };
 
 
  const handleRightRotate=()=>{
    setRotationRight((prevRotation)=>prevRotation-15)
  }


const style = {
      border: "1px solid #ccc",
      margin: "5px",
      padding: "10px",
    };
    const handleDrop = (event) => {
      event.preventDefault();
      const droppedItem = JSON.parse(event.dataTransfer.getData('application/json'));
     

      if (droppedItem.type === 'TURN') {
        const degrees = droppedItem.degrees;
        const rotationDirection = droppedItem.rotationDirection;
        if (rotationDirection === 'clockwise') {
          setRotation((prevRotation) => prevRotation + degrees);
        } else if (rotationDirection === 'anticlockwise') {
          setRotationRight((prevRotation) => prevRotation - degrees);
        }
      }
    
      setDroppedItems((prevItems) => [...prevItems, droppedItem]);
      onDrop && onDrop(droppedItem);
    };
    
    const handlePlay2 = () => {
      droppedItems.forEach(async(item) => {
        if (item.type === 'MOVE') {
          onMove(item.steps)
        } 
        else if (item.type === 'TURN' && item.rotationDirection == 'clockwise') {
          onleftRotate()
        }
        else if (item.type === 'TURN' && item.rotationDirection == 'anticlockwise') {
          onRightRotate()
        }
        else if (item.type === 'SAY') {
          handleSayHello(item.text)
          // handleRotate(item.degrees)
        }
        await delay(500); 
        
      });
    };
    const getRandomPosition = () => {
      const maxX = screenWidth - 50; // Adjust the width of your cat sprite
      const maxY = screenHeight - 50; // Adjust the height of your cat sprite
    
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
    // console.log("newX",newX)
      return { x: newX, y: newY };
    };
    const handlePlay = async () => {
      for (const item of droppedItems) {
        if (item.type === 'MOVE') {
          // await onMove(item.steps);
          await onMove({ x: item.steps, y: 0 });
        } else if (item.type === 'TURN' && item.rotationDirection === 'clockwise') {
          await onleftRotate();
        } else if (item.type === 'TURN' && item.rotationDirection === 'anticlockwise') {
          await onRightRotate();
        } else if (item.type === 'SAY') {
          await handleSayHello(item.text);
        }
       else if (item.type === 'GOTOXY') {
        // console.log("go",item)
        const x = parseInt(enteredNumber);
        const y = parseInt(enteredNumbery);

        if (!isNaN(x) && !isNaN(y)) {
          const coordinates = { x, y };
          await onGoToXY(coordinates);
        }
     
      }
      else if(item.type==='GO'){
        // console.log("mm")
       
          const randomPosition = getRandomPosition();
        
          const boundedX = Math.min(screenWidth - 50, Math.max(0, randomPosition.x));
          const boundedY = Math.min(screenHeight - 50, Math.max(0, randomPosition.y));
        
         setCatPosition({ x: boundedX, y: boundedY });
         await onGoToRandomPosition({ x: boundedX, y: boundedY })
        
      }
      else if (item.type === 'Custome') {
        // console.log("saytext",sayTexts,item.text)
        await handleSayHello(sayTexts);
      }
    
        await delay(500); 
      }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
   const handleDragOver = (event) => {
      event.preventDefault();
    };
    const handleRemoveItem = (index) => {
      const updatedItems = [...droppedItems];
      updatedItems.splice(index, 1);
      setDroppedItems(updatedItems);
    };
    const handleDragStart = (event, item, index) => {
      event.dataTransfer.setData('application/json', JSON.stringify(item));
    
      setDroppedItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(index, 1); 
        return updatedItems;
      });
    };

   
   
  return (

    <div className="flex-1 h-full overflow-auto" onDrop={handleDrop} onDragOver={handleDragOver}>
    {droppedItems.map((item, index) => (
      <div
        className={`flex flex-row flex-wrap text-white px-2 py-1 my-2 text-sm cursor-pointer 
          ${(item.type === 'SAY' || item.type === 'Custome') ? 'bg-yellow-500' : (item.type === 'GOTOXY'|| item.type=='GO') ? 'bg-purple-500' : 'bg-blue-500'
        }`}
        style={{ borderRadius: '8px' }}
        key={item.id}
        draggable
        onDragStart={(event) => handleDragStart(event, item, index)}

      >
        {/* {item.type == 'SAY' ? 'Say ' + item.text + ' for 2 seconds' : item.type} */}
        {item.type === 'SAY' ? 'Say ' + item.text + ' for 2 seconds' :
     item.type === 'Custome' ? 'Say ' :
     item.type === 'GOTOXY' ? 'Go To' :
     item.type ==='MOVE' ?'Move':
     item.type ==='GO' ? 'Go':
     item.type
    }
        {item.type === 'TURN' && (
          <div className="flex">
            {item.rotationDirection === 'clockwise' && (
              <Icon name="redo" size={15} className="text-white mx-2" />
            )}
            {item.rotationDirection === 'anticlockwise' && (
              <Icon name="undo" size={15} className="text-white mx-2" />
            )}
            {item.degrees && (
              <span>{item.degrees} degrees</span>
            )}
          </div>
        )}
        {item.steps && (
          <span>{item.steps} steps</span>
        )}
        {item.type === "GOTOXY" && (
          <div className="flex flex-row flex-wrap bg-purple-500 text-white px-2  py-1 text-sm cursor-pointer">
            {"X"}
            <input
              type="number"
              value={enteredNumber}
              onChange={handleInputChange}
              style={{
                color: 'black',
              }}
              className="mx-2 w-10  border border-gray-300 rounded"
            />
            {"And Y"}
            <input
              type="number"
              value={enteredNumbery}
              onChange={handleInputChangey}
              style={{
                color: 'black',
              }}
              className="mx-2 w-10 border border-gray-300 rounded"
            />
          </div>
        )}
         {item.type === "GO" && (
 <div
 
//  className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
 style={{ borderRadius: '10px' ,marginRight: '10px'}}
//  onClick={handleGoToRandomPosition }
>
 {" To Random position "}</div>
         )}
         {item.type=='Custome'&&(
         
           <input
          type="text"
          // value={sayText}
          value={sayTexts[index] || ''}
          onChange={(event) => handleInputChangeSayText(event, index)}
          // onChange={handleInputChangeSayText}
          style={{
            color: 'black',
            width: '80px', // Adjust the width as needed
            marginRight: '10px',
          }}
          className="border border-gray-300 rounded px-2 py-1"
        />)}
        {/* <button onClick={() => handleRemoveItem(index)}>Remove</button> */}
      </div>
    ))}
    <button onClick={handlePlay}> <Icon name="flag" size={15} className="text-green-600 mx-2" /></button>
  </div>
  
  );  

 
}

