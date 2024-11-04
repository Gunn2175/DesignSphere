// Design.js
import React, { useState,useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/DesignLayout/Sidebar';
import CanvasArea from '../components/DesignLayout/CanvasArea';
import PropertiesPanel from '../components/DesignLayout/PropertiesPanel';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserContext } from '../context/UserContext'; 
  
const Design = () => {
    const { designId } = useParams();
    const [elements, setElements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#fff'); // Default background color
    const [title, setTitle] = useState('');
    const { currentUser } = useContext(UserContext); // Get current user from context
    console.log('Current User:', currentUser);
    //const currentUserId = currentUser ? currentUser.id : null; 
   
    useEffect(() => {
        const fetchDesign = async () => {
           if (designId) { // Load design for editing if ID exists
              try {
                console.log("Fetching design with ID:", designId);
                 const response = await axios.get(`/designs/${designId}`);
                  console.log('information:');
                 console.log("response",response.data);
                 const { title, elements, backgroundColor } = response.data;
                 console.log('oldelements',elements)
                 const updatedElements = elements.map(element => {
                    // Only modify imageUrl if it exists and the element is an image
                    const updatedImageUrl = element.imageUrl 
                        ? `${element.imageUrl.replace(/\\/g, '/')}`  // Ensure leading slash and replace backslashes
                        : undefined;  // Keep as undefined if not an image element
                
                    return {
                        ...element,
                        imageUrl: updatedImageUrl  // This will only update for elements with an imageUrl
                    };
                });
                
              
                
                
                console.log("updated elements",updatedElements);

                 setTitle(title);
                 setElements(updatedElements);
                 setBackgroundColor(backgroundColor);
              } catch (error) {
                 console.error('Error loading design:', error);
              }
           }
        };
        fetchDesign();
     }, [designId]);
    const saveDesign = async () => {
        
            const inputTitle = prompt("Please enter a title for your design:",title?title:' ');
            if (!inputTitle) return alert("Design not saved. Title is required.");
       
         
         try {
            if (!currentUser) {
                return alert("User must be logged in to save a design.");
            }
            console.log('Current title before saving:', title);
            const payload = {
               userId: currentUser?._id,
               title: inputTitle,
               elements,
               backgroundColor,
            };
            console.log(elements)
            console.log('Payload to be sent:', payload)
            if (designId) {
               await axios.put(`/designs/${designId}`, payload);
               console.log('Design updated:', payload);
            } else {
               await axios.post('/designs/save', payload);
               console.log('New design saved:', payload);
            }
            setTitle(inputTitle);
         } catch (error) {
            console.error('Failed to save design:', error);
         } 
        };
    
    const deleteItem = (id) => {
        setElements((prevItems) => prevItems.filter(item => item.id !== id));
        setSelectedItem(null); // Optionally clear the selected item
    };
    const updateItemProperties = (id, updatedProperties) => {
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === id ? { ...item, ...updatedProperties } : item
            )
        );
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem((prev) => ({ ...prev, ...updatedProperties }));
        }
    };
    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
    };

 
 

    return (
        <DndProvider backend={HTML5Backend}>
        <>
            <Header/>
            <div className="editor-container">
   <div className="sidebar"> <Sidebar setElements={setElements} /></div>
    <div className="main-content">
       <div  className="properties-panel" ><PropertiesPanel 
                               selectedItem={selectedItem}
                               updateItemProperties={updateItemProperties}
                               onBackgroundColorChange={handleBackgroundColorChange}
                               deleteItem={deleteItem}
       />

       </div> 
        <div className="canvas-container">
            <button onClick={saveDesign} className="save-button">Save Design</button>
            <CanvasArea elements={elements} 
                        setElements={setElements}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        updateItemProperties={updateItemProperties}
                        backgroundColor={backgroundColor}
                       
                        className="canvas-area" />
        </div>
    </div>
</div>

        </>
        </DndProvider>
    );
};


export default Design;