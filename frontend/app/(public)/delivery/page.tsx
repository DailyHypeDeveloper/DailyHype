

"use client";

/*import { useState } from 'react';
import { Calendar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

const deliveryData = [
  {
    date: '2023-01-10',
    details: 'Delivered to John Doe at 123 Main St.',
  },
  {
    date: '2023-01-15',
    details: 'Out for delivery. Expected delivery time: 2:00 PM - 4:00 PM.',
  },
  // Add more delivery details as needed
];

export default function DeliveryPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Logic to fetch and set delivery details for the selected date
    const deliveryForDate = deliveryData.find((delivery) => delivery.date === date);
    setSelectedDelivery(deliveryForDate);
  };

  return (
    <>
      <div className="flex flex-row max-w-full mx-28 my-10">

        <div className="w-1/3">
          <Calendar selected={selectedDate} onChange={handleDateChange} />
        </div>

        <div className="w-2/3 pl-8">
          {selectedDelivery ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
              <div className="bg-white p-4 shadow-md rounded-md">
                <p className="text-lg">{selectedDelivery.details}</p>
              </div>
            </div>
          ) : (
            <p className="text-lg">Select a date on the calendar to view delivery details.</p>
          )}
        </div>
      </div>
    </>
  );
}*/
