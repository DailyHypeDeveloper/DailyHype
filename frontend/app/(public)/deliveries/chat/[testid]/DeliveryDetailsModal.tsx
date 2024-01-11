// DeliveryDetailsModal.tsx

"use client";


import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Progress } from "@nextui-org/react";

const DeliveryDetailsModal = ({ isOpen, onClose, selectedDelivery }: any) => {
  const getProgressValue = (status: string) => {
    // Implement your logic to calculate progress value based on the delivery status
    return 50; // Replace with your actual calculation
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); }}>
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
        <Button color="primary" onPress={() => { onClose(); }}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeliveryDetailsModal;
