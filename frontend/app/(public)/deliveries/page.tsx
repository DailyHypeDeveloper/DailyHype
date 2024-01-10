// App.js
"use client";
import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Progress } from "@nextui-org/react";

import { useRouter } from 'next/navigation';



import { Card, CardBody } from "@nextui-org/react";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import './calendarstyle.css';

//import { useRouter } from 'next/router';

// Inside your component function
//const router = useRouter();

/*const navigateToChatRoom = (delivery: any) => {
  // Assume '/deliveries/[deliveryId]' is the route for the chat room
  const chatRoomUrl = `/deliveries/${delivery.deliveryId}`;
  // Navigate to the chat room
  router.push(chatRoomUrl);
};*/

export default function DeliveryPage() {
  const router = useRouter();

  /*const navigateToChatRoom = (delivery: any) => {

    // Assume '/chat/[deliveryId]' is the route for the chat room
    const chatRoomUrl = `/deliveries/chat/${delivery.deliveryId}?data=${encodeURIComponent(JSON.stringify(delivery))}`;
    //${delivery.deliveryId}
    // Navigate to the chat room
    router.push(chatRoomUrl);
  };*/

  const navigateToChatRoom = async (userid: any, delivery: any) => {
    try {

      // Make a request to the backend endpoint to get the roomId using the Fetch API
      const response = await fetch(`${process.env.BACKEND_URL}/api/getRoomId?userUserID=${userid}&deliveryID=${delivery.deliveryId}`);
  
      // Check if the request was successful (status code in the range 200-299)
      if (response.ok) {
        // Assuming the response is JSON, parse it
        const responseData = await response.json();
  
        // Assuming the response is an object with a 'room_Id' property
        const roomId = responseData.room_Id;
  
        // Assume '/chat/[roomId]' is the route for the chat room
        const chatRoomUrl = `/deliveries/chat/${roomId}?data=${encodeURIComponent(JSON.stringify(delivery))}`;
        
        // Navigate to the chat room
        router.push(chatRoomUrl);
      } else {
        // Handle non-successful response (e.g., show an error message)
        console.error('Error getting roomId:', response.statusText);
      }
    } catch (error) {
      // Handle error, e.g., log it or show a notification
      console.error('Error getting roomId:', error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [date, setDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [deliveryData, setDeliveryData] = useState<any[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [selectedDateFilters, setSelectedDateFilters] = useState<string[]>([]);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/api/Alldeliveries/user/1`)
      .then(response => response.json())
      .then((data: any[]) => {
        console.log("Received data:", data);
        data.sort((a: any, b: any) => {
          const dateA = new Date(a.deliveryTime);
          const dateB = new Date(b.deliveryTime);
          return dateA.getTime() - dateB.getTime();
        });
        setDeliveryData(data);
        setSelectedDates(data.map(item => item.deliveryTime.split('T')[0]));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderTileContent = ({ date, view }: any) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(date.getDate() + 1); // Subtract one day
    const dateString = adjustedDate.toISOString().split("T")[0];
  
    const isGreenCircle = selectedDates.includes(dateString);
    const isBlueCircle = selectedDateFilters.includes(dateString);
  
    return (
      <div className="circle-container" onClick={() => toggleDateSelection(dateString)}>
        {isGreenCircle && <div className="green-circle"></div>}
        {isBlueCircle && <div className="blue-circle"></div>}
      </div>
    );
  };
  

  const toggleDateSelection = (dateString: string) => {
    if (selectedDateFilters.includes(dateString)) {
      // Deselect the date
      setSelectedDateFilters(prevFilters => prevFilters.filter(filter => filter !== dateString));
    } else {
      // Select the date
      setSelectedDateFilters(prevFilters => [...prevFilters, dateString]);
    }
  };

  const renderDeliveryCards = () => {
    // Filter deliveryData based on selectedDateFilters
    const filteredData = selectedDateFilters.length > 0
      ? deliveryData.filter(item => selectedDateFilters.includes(item.deliveryTime.split('T')[0]))
      : deliveryData;

    return (
      <div className="row">
        {filteredData.map((delivery) => (
          <Card key={delivery.deliveryId} className="col-md-12 mb-4">
          <CardBody>
            <h5 className="card-title">Delivery #{delivery.deliveryId}</h5>
            <p><strong>Estimated Delivery Date:</strong> {new Date(delivery.deliveryTime).toDateString()}</p>
            <p className="card-text">Address: {delivery.deliveryAddress}</p>
            <p className="card-text">Time: {new Date(delivery.deliveryTime).toLocaleTimeString()}</p>
            <p className="card-text">Status: {delivery.deliveryStatusDetail}</p>

            {/*}<p className="card-text">Tracking Number: {delivery.trackingNumber}</p>

            <h6>Items:</h6>
            <ul>
              {delivery.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.name} - {item.price}
                </li>
              ))}
            </ul>

              */}

            <button type="button" className="btn btn-primary mr-2" onClick={() => openModal(delivery)}>
              View Details
            </button>

            {/* Chat Button */}
            <button
              type="button"
              className="btn btn-success"
              onClick={() => navigateToChatRoom(52, delivery)}
            >
              Chat
            </button>
          </CardBody>
        </Card>
        ))}
      </div>
    );
  };

  const openModal = (delivery: any) => {
    setSelectedDelivery(delivery);
    onOpen();
  };

  const getProgressValue = (statusDetail: string) => {
    switch (statusDetail) {
      case 'Order confirmed':
        return 25;
      case 'Ready for pickup by company':
        return 50;
      case 'On the way':
        return 75;
      case 'Product delivered':
        return 99;
      default:
        return 0; // Default value when status is unknown
    }
  };

 

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">Delivery Details</h2>

      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Selected Date and Time</h5>
              <Calendar
                onChange={handleDateChange}
                value={date}
               
                className={`border border-green-500 rounded-md p-2 react-calendar`}
                tileClassName={(value) =>
                  selectedDates.includes(
                    new Date(value.date).toISOString().split("T")[0]
                  )
                    ? "has-delivery"
                    : ""
                }
                tileContent={renderTileContent}
              />
            </div>
          </div>
        </div>

        <div
          className="col-md-6"
          style={{ height: "700px", overflow: "auto", marginLeft: "20px" }}
        >
          <h2 id="cardsMainHeader"></h2>
          {renderDeliveryCards()}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => { onClose(); setSelectedDelivery(null); }}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delivery Details</ModalHeader>
              <ModalBody>
  {selectedDelivery && (
    <>
      <h5 className="card-title">Delivery #{selectedDelivery.deliveryId}</h5>
      <p><strong>Estimated Delivery Date:</strong> {new Date(selectedDelivery.deliveryTime).toDateString()}</p>
      <p className="card-text">Address: {selectedDelivery.deliveryAddress}</p>
      <p className="card-text">Time: {new Date(selectedDelivery.deliveryTime).toLocaleTimeString()}</p>
      <p className="card-text">Status: {selectedDelivery.deliveryStatusDetail}</p>
      <Progress label={`${getProgressValue(selectedDelivery.deliveryStatusDetail)}% ${'Progress'}`} value={getProgressValue(selectedDelivery.deliveryStatusDetail)} className="max-w-md"/>


           <p className="card-text">Tracking Number: {selectedDelivery.trackingNumber}</p>

      <h6>Items:</h6>
      <div className="grid grid-cols-3 gap-4">
        {selectedDelivery.items.map((item: any, index: number) => (
          <div key={index} className="text-center">
            <img src={item.image} alt={item.name} className="max-w-full h-auto mb-2" />
            <p className="mb-2">{item.name}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </>
  )}
</ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => { onClose(); setSelectedDelivery(null); }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}


