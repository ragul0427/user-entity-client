import "./App.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"

function App() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [form] = Form.useForm();
 

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URI}/getuser`
      );
      setData(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (val) => {
    setUpdateId(val.id);
    setOpen(!open)
    form.setFieldsValue(val)
  };

  const handleFinish = async (values) => {
    if (updateId !== "") {
      console.log("reuwnask")
      try {
        await axios.patch(`${process.env.REACT_APP_API_URI}/update/${updateId}`, values);
        fetchData();
        setUpdateId("")
        setOpen(!open)
      } catch (err) {
        console.log(err, "error");
      }
    } else {
      
      try {
        await axios.post(`${process.env.REACT_APP_API_URI}/create`, values);
        fetchData();
        setOpen(!open)
      } catch (err) {
        console.log(err, "error");
      }
      
    }
  };

  

  const handleDelete = async (val) => {
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URI}/deleteuser`, {
        id: val.id,
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[6vw]">S.no</h1>,
      dataIndex: "sno",
      key: "sno",
      render: (text, record, index) => {
        return <h1 className="text-[10px] md:text-[14px] w-[5vw]">{index + 1}</h1>;
      },
    },
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[14.5vw]">FirstName</h1>,
      dataIndex: "firstName",
      key: "firstName",
      render:(text)=><div className="text-[10px] md:text-[14px] lg:!text-[16px] w-[14.5vw]">{text}</div>
    },
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[14.2vw]">LastName</h1>,
      dataIndex: "lastName",
      key: "lastName",
      render:(text)=><div className="text-[10px] md:text-[14px] lg:!text-[16px] w-[14.2vw]">{text}</div>

    },
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[8vw]">D.O.B</h1>,
      dataIndex: "dob",
      key: "dob",
      render:(text)=><div className="text-[9px]  md:text-[14px] lg:!text-[16px] w-[8vw]">{moment(text, 'YYYY-MM-DD').format('DD-MM-YYYY')}</div>
    },
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[15vw]">Address</h1>,
      dataIndex: "address",
      key: "address",
      render:(text)=><div className="text-[9px] md:text-[14px] lg:!text-[16px] w-[15vw]">{text}</div>
    },
    {
      title: <h1 className="text-[9px] md:text-[14px] w-[10vw]">Actions</h1>,
      render: (res) => {
        return (
          <div className="flex items-center justify-center md:gap-2 text-[10px] w-[10vw]">
            <div className="text-green-500  cursor-pointer">
              <EditNoteIcon
                className="!text-[14px] md:!text-[20px]"
                onClick={() => {
                  handleEdit(res);
                }}
              />
            </div>
            <div
              className="text-red-500 cursor-pointer"
              onClick={() => {
                handleDelete(res);
              }}
            >
              <DeleteIcon className="!text-[12px] md:!text-[18px]" />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-red-500 py-3 w-screen text-white flex justify-around">
        <h1 className="md:text-xl"> Full Stack Application For User Entity</h1>
        <AddCircleOutlineIcon
          onClick={() => {
            setOpen(!open);
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="xsm:!w-[100vw] md:w-[90vw] pt-10">
        <Table columns={columns} dataSource={data} className="w-[100vw] "/>
      </div>

      <Modal
        open={open}
        width={400}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={false}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            label="FirstName"
            name="firstName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label="LastName"
            name="lastName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label="Date Of Birth"
            name="dob"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="date" className="w-[100%]" size="large" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea type="text" size="large" />
          </Form.Item>

          <div className="flex gap-5 justify-end self-end">
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setOpen(!open);
                setUpdateId("")
              }}
              className="bg-red-500"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="!bg-green-500">
              {updateId!==""?"Update":"Save"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
