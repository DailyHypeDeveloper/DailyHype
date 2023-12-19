"use client";

import { useAppState } from "@/app/app-provider";
import { useEffect, useState } from "react";
import React from "react";
import { Listbox, ListboxItem, Switch, Card, CardBody, CardFooter, Image, Tooltip, Pagination, Input } from "@nextui-org/react";


const ChevronRightIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ItemCounter = ({ number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <ChevronRightIcon className="text-xl" />
  </div>
);
//category side bar end

//get sidebar category by Type ID
const getSidebarCategoryByType = () => {
  const typeid = 1;//men
  return fetch(`${process.env.BACKEND_URL}/api/categories/${typeid}`)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result.category);
      //result.category -> categoryid, categoryname, createdat, updatedat
      return result.category;
    })
}

const getProductData = () => {

  return Promise.all([getSidebarCategoryByType()]).then(([categoryResult])=>{
    return {categoryResult:categoryResult, product:null}
  })
}

export default function ManProduct() {
  const { setCurrentActivePage } = useAppState();
  const [isInStock, setIsInStock] = useState(true);
  const [noOfItems, setNoOfItems] = useState(20);
  //card body start
  const [currentPage, setCurrentPage] = useState(1);
  const [isInvalid, setIsInvalid] = useState(false);
  const [selectedSidebarCategory, setSelectedSidebarCategory] = useState();
  let sidebarCategories;

  const list = [
    {
      title: "Orange",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701614551/Design/whysekfgafkfpp5vqrob.jpg",
      rating: 4.5,
      price: "$5.50",
    },
    {
      title: "Tangerine",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701620015/Design/xk8bbhvj3wrvlpt74fmr.jpg",
      rating: 4.5,
      price: "$3.00",
    },
    {
      title: "Raspberry",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701654374/Design/zowhsykbcnjvlasftkoy.jpg",
      rating: 4.5,
      price: "$10.00",
    },
    {
      title: "Lemon",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701653979/Design/ucekqcbpf8d2jpbfmu7y.jpg",
      rating: 4.5,
      price: "$5.30",
    },
    {
      title: "Avocado",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701612809/Design/mlwkzdyvayfkvdwco67j.jpg",
      rating: 4.5,
      price: "$15.70",
    },
    {
      title: "Lemon 2",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701605353/Design/tqwyvv7v7i5ac1m8e2ih.jpg",
      rating: 4.5,
      price: "$8.00",
    },
    {
      title: "Lemon 2",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701615388/Design/qnjwrwjldxztfirov5dd.jpg",
      rating: 4.5,
      price: "$8.00",
    },
    {
      title: "Lemon 2",
      img: "http://res.cloudinary.com/don5px3rf/image/upload/v1701614948/Design/epgq3l7svzt7g5aekjme.jpg",
      rating: 4.5,
      price: "$8.00",
    },
  ];
  //card body end

  useEffect(() => {
    setCurrentActivePage("man");
     
  }, []);

  const handleItemsInputChange = (value: string) => {
    const newValue = parseInt(value, 10);
    if (newValue >= 20 && newValue <= 100) {
      setNoOfItems(newValue);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  }

  return (
    <div className="flex">


      <Listbox
        aria-label="User Menu"
        onAction={(key) => alert(key)}
        className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small"
        itemClasses={{
          base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
        }}
      >
        <ListboxItem
          key="issues"
          endContent={<ItemCounter number={13} />}
        >
          Issues
        </ListboxItem>
        <ListboxItem
          key="pull_requests"
          endContent={<ItemCounter number={6} />}

        >
          Pull Requests
        </ListboxItem>
        <ListboxItem
          key="discussions"
          endContent={<ItemCounter number={293} />}

        >
          Discussions
        </ListboxItem>
        <ListboxItem
          key="actions"
          endContent={<ItemCounter number={2} />}

        >
          Actions
        </ListboxItem>
        <ListboxItem
          key="projects"
          endContent={<ItemCounter number={4} />}

        >
          Projects
        </ListboxItem>
        <ListboxItem
          key="releases"
          className="group h-auto py-3"
          endContent={<ItemCounter number={399} />}

          textValue="Releases"
        >
          <div className="flex flex-col gap-1">
            <span>Releases</span>
            <div className="px-2 py-1 rounded-small bg-default-100 group-data-[hover=true]:bg-default-200">
              <span className="text-tiny text-default-600">@nextui-org/react@2.0.10</span>
              <div className="flex gap-2 text-tiny">
                <span className="text-default-500">49 minutes ago</span>
                <span className="text-success">Latest</span>
              </div>
            </div>
          </div>
        </ListboxItem>
        <ListboxItem
          key="contributors"
          endContent={<ItemCounter number={79} />}

        >
          Contributors
        </ListboxItem>
        <ListboxItem
          key="watchers"
          endContent={<ItemCounter number={82} />}

        >
          Watchers
        </ListboxItem>
        <ListboxItem
          key="license"
          endContent={<span className="text-small text-default-400">MIT</span>}

        >
          License
        </ListboxItem>
      </Listbox>

      <div className="flex flex-col m-5 border w-full">
        <h1 className="text-2xl font-semibold">Women Jumpsuits & Bodysuits</h1>
        <div className="flex justify-end m-2 gap-2">
          <h5 className="font-medium text-sm mt-0.5">Show Only In stock Items</h5>
          <Switch defaultSelected color="success" size="sm" onValueChange={(isSelected: boolean) => { setIsInStock(isSelected); }}></Switch>
        </div>
        <div className="gap-5 m-5 grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
          {list.map((item, index) => (

            <Tooltip key={index} color={'warning'} content={item.title} className="capitalize">
              <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.title}
                    className="w-full object-cover h-[140px]"
                    src={item.img}
                  />

                </CardBody>
                <CardBody className="mt-2 py-0 ">
                  <b>{item.title}</b>
                </CardBody>
                <CardFooter className="py-1 text-small gap-1">
                  <p className="mt-0.5">{item.rating}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="fill-yellow-400 stroke-0 hover:stroke-2 stroke-yellow-400 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>

                </CardFooter>
                <CardBody className="mb-1 py-0">
                  <p className="text-default-500">${item.price}</p>
                </CardBody>
              </Card>
            </Tooltip>
          ))}
        </div>
        <div className="flex flex-row justify-between">
          <div className=" max-w-[100px]">
            <Input
              type="number"
              label="No of Items"
              defaultValue={noOfItems.toString()}
              min={20}
              max={100}
              labelPlacement="outside"
              isInvalid={isInvalid}
              color={isInvalid ? "danger" : "success"}
              errorMessage={isInvalid && "Please enter number between 20 and 100"}
              startContent={
                <div className="sm pointer-events-none flex items-center">
                </div>
              }
              onValueChange={(value: string) => { handleItemsInputChange(value) }}
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p> page {currentPage} of 10</p>
            <Pagination loop showControls color="success" total={10} initialPage={1} onChange={(page: number) => setCurrentPage(page)} />
          </div>
        </div>
      </div>
    </div>
  );
}
