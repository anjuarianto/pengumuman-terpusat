import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Select from "react-select";
import { number } from "prop-types";

const API_URL = "/api/room";
const HEADERS = {
  Authorization: "Bearer " + Cookies.get("accessToken"),
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

const ModalRoom: React.FC<ModalRoomProps> = ({
  isModalOpen,
  isEdit,
  onClose,
}) => {
  const RoomForm = useForm<Room>();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [memberSelected, setMemberSelected] = useState<any>([]);
  const [memberOptions, setMemberOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const loadAllUser = async () => {
    try {
      const userResponse = await axios.get(`/api/user`, {
        headers: HEADERS,
      });

      const userGroupResponse = await axios.get(`/api/user-group`, {
        headers: HEADERS,
      });

      const user = userResponse.data.data.map((user: any) => ({
        label: user.name,
        value: "1" + "|" + user.id,
      }));

      const userGroup = userGroupResponse.data.data.map((userGroup:any) => ({
        label: userGroup.name + "(Group)",
        value: "0" + "|" + userGroup.id
      }))

      let members = user.concat(userGroup)

      setMemberOptions(members);
    } catch (error) {
      console.log(error);
    }
  };
  const loadRoomDataById = async (value: number) => {
    try {
      const response = await axios.get(`${API_URL}/${value}`, {
        headers: HEADERS,
      });

      const members = response.data.data.members.map((member: any) => ({
        label: member.name,
        value: "1" + "|" + member.id,
      }));

      setMemberSelected(members);

      setRoomData({
        id: response.data.data.id,
        name: response.data.data.name,
        description: response.data.data.description,
        members: members,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
    RoomForm.reset();
    setMemberSelected([]);
    setRoomData(null);
  };

  const onSubmit: SubmitHandler<Room> = async (data) => {
    try {
      const members = memberSelected.map((member: any) => member.value);

      const response = await axios({
        method: isEdit ? "PUT" : "POST",
        url: isEdit ? `${API_URL}/${isEdit}` : API_URL,
        data: {
          name: data.name,
          description: data.description,
          members: members,
        },
        headers: HEADERS,
      });

      response.data.status === "success" && handleClose();

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        customClass: {
          container: "my-swal-popup ",
        },
        text: response.data.message,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        customClass: {
          container: "my-swal-popup ",
        },
        text: err.response.data.message,
      });
    }
  };

  useEffect(() => {
    if (isModalOpen && isEdit) {
      loadAllUser();
      loadRoomDataById(isEdit);
    }

    if (isModalOpen && !isEdit) {
      loadAllUser();
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
          className="flex flex-col items-center w-full md:w-2/5  h-3/5  bg-white rounded-lg shadow-lg "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
            {isEdit ? "Edit Kategori" : "Add Kategori"}
          </div>
          <div className="w-full px-4 md:px-24 py-4 overflow-y-auto">
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
                  defaultValue={isEdit ? roomData?.name : ""}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  {...RoomForm.register("name", { required: true })}
                />
              </div>
              <div>
                <label className=" text-gray-700 font-bold">Deskripsi</label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="Description"
                  defaultValue={isEdit ? roomData?.description : ""}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  {...RoomForm.register("description", { required: true })}
                />
              </div>
              {/*<div>*/}
              {/*  <div>*/}
              {/*    <label className=" text-gray-700 font-bold">Members</label>*/}
              {/*    <Controller*/}
              {/*      name="members"*/}
              {/*      control={RoomForm.control}*/}
              {/*      render={({ field }) => (*/}
              {/*        <Select*/}
              {/*          {...field}*/}
              {/*          value={memberSelected}*/}
              {/*          placeholder="Members :..."*/}
              {/*          isMulti*/}
              {/*          isSearchable*/}
              {/*          options={memberOptions}*/}
              {/*          className="basic-multi-select"*/}
              {/*          classNamePrefix="select"*/}
              {/*          onChange={(value) => {*/}
              {/*            setMemberSelected(value);*/}
              {/*          }}*/}
              {/*        />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="px-24 py-2 mt-4 text-white bg-blue-500 rounded-lg w-fit hover:bg-blue-600"
                >
                  Kirim
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
