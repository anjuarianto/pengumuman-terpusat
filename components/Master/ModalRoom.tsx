import React, {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import { Modal } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Select from "react-select";
import {number} from "prop-types";

const API_URL = 'http://127.0.0.1:8000/api/room';
const HEADERS = {
  Authorization: "Bearer " + Cookies.get("accessToken")
};

type Room = {
  id: number;
  name: string;
  description: string;
  members: {
    id: number;
    name: string;
    is_single_user: boolean;
  }[];
};

type ModalRoomProps = {
  isModalOpen: boolean;
  isEdit: number;
  onClose: () => void;
};

const ModalRoom: React.FC<ModalRoomProps> = ({ isModalOpen, isEdit , onClose}) => {
  const RoomForm = useForm<Room>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [memberSelected, setMemberSelected] = useState<any>([]);
  const [memberOptions, setMemberOptions] = useState<{
    value: string;
    label: string;
  }[]>([]);



  const loadAllUser = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user`, { headers: HEADERS});

      const members = response.data.map((user: any) => ({
        label: user.name,
        value: "1" + "|" + user.id,
      }));

      setMemberOptions(members)
    } catch (error) {
      console.log(error);
    }
  }
  const loadRoomDataById = async (value: number) => {
    try {
      const response = await axios.get(`${API_URL}/${value}`, { headers: HEADERS});

      const members = response.data.data.members.map((member: any) => ({
        label:member.name,
        value: "1" + "|" + member.id
      }));

      setMemberSelected(members);
      setName(response.data.data.name);
      setDescription(response.data.data.description);

    } catch(error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    onClose();
    RoomForm.reset();
    setMemberSelected([]);
    setRoomData(null);
  }

  const onSubmit: SubmitHandler<Room> = async (data) => {
    try {

      const members = memberSelected.map((member: any) => member.value);
      console.log(members)
      const response = await axios({
        method: isEdit ? "PUT" : "POST",
        url: isEdit ? `${API_URL}/${isEdit}` : API_URL,
        data: {
            name: name,
            description: description,
            members: members
        },
        headers: HEADERS
      });

      response.data.status === "success" && handleClose();

      await Swal.fire({
        icon: "success",
        title: "Success",
        customClass: {
          container: "my-swal-popup ",
        },
        text: response.data.message,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          container: "my-swal-popup ",
        },
        text: isEdit
            ? "Gagal update pengumuman"
            : "Gagal membuat pengumuman",
      });
    }
  };

  useEffect(() => {

    if (isModalOpen && isEdit) {
      loadAllUser()
      loadRoomDataById(isEdit);
    }


    if(isModalOpen && !isEdit) {
      loadAllUser()
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <Modal open={isModalOpen}>
      <div
        className="flex flex-col items-center justify-center h-screen"
        onClick={handleClose}
      >
        <div
          className="flex flex-col items-center w-2/5 h-auto bg-white rounded-lg shadow-lg "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="w-full h-full py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
            Edit Room
          </div>
          <div className="w-full px-24 py-4">
            <form
              onSubmit={RoomForm.handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-4"
            >
              <div>
                <label className=" text-gray-700 font-bold">Nama</label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="Judul"
                  defaultValue={isEdit ? name : ""}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  {...RoomForm.register("name", { required: true })}
                />
              </div>
              <div>
                <label className=" text-gray-700 font-bold">
                  Description
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="Description"
                  defaultValue={isEdit ? description : ''}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  {...RoomForm.register("description", { required: true })}
                />
              </div>
              <div>
                <div>
                  <label className=" text-gray-700 font-bold">
                    Members
                  </label>
                  <Controller
                      name="members"
                      control={RoomForm.control}
                      render={({field}) => (
                          <Select
                              {...field}
                              value={memberSelected}
                              placeholder="Members :..."
                              isMulti
                              isSearchable
                              options={memberOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(value) => {
                                setMemberSelected(value);
                              }}
                          />
                      )}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button
                    type="submit"
                    className="px-24 py-2 mt-4 text-white bg-blue-500 rounded-lg w-fit hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRoom;