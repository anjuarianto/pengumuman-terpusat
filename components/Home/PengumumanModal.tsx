import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import Cookies from "js-cookie";
import { Modal } from "@mui/material";
import Swal from "sweetalert2";
import UploadAdapter from "./UploadAdapter";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};

type PengumumanData = {
  room: { value: string; label: string }[];
  recipients: { value: string; label: string }[];
  title: string;
  date: string;
  time: string;
  content: string;
  attachment: Blob[];
};

type PengumumanModal = {
  isModalOpen: boolean;
  isEdit: number | null;
  onClose: () => void;
  roomActive: number;
};

export default function PengumumanModal({
  isModalOpen,
  onClose,
  isEdit,
  roomActive,
}: PengumumanModal) {
  const [editorData, setEditorData] = useState<string>("");

  const [editPengumumanData, setEditPengumumanData] = useState<{
    title: string;
    date: string;
    time: string;
    content: string;
    room: { label: string; value: string } | undefined;
    recipients: { label: string; value: string } | undefined;
    files: { file: string; original_name: string }[];
    isEdit: boolean;
  } | null>(null);

  const [mahasiswaOptions, setMahasiswaOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [mahasiswaSelectedValue, setMahasiswaSelectedValue] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const pengumumanForm = useForm<PengumumanData>({
    mode: "onChange",
  });

  useEffect(() => {
    if (roomActive) {
      handleRoomChange(roomActive);
    }

    if (isModalOpen && isEdit) {
      loadRoomData();
      loadEditPengumuman();
    }

    if (isModalOpen && !isEdit) {
      loadRoomData();
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);
  const loadRoomData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/room", {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleRoomChange = async (value: any) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/room/${value}`,

        {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      const mappedData = response.data.data.members.map((mahasiswa: any) => ({
        value: (mahasiswa.is_single_user ? 1 : 0) + "|" + mahasiswa.id,
        label: mahasiswa.name,
      }));
      setMahasiswaOptions(mappedData);
    } catch (err) {}
  };

  const loadEditPengumuman = async () => {
    if (isEdit === undefined) return;

    const response = await axios.get(
      `http://127.0.0.1:8000/api/pengumuman/${isEdit}`,
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }
    );

    const waktuParts = response.data.data.waktu.split(" ");
    const date = waktuParts[0];
    const time = waktuParts[1];
    const room = {
      label: response.data.data.room.name,
      value: response.data.data.room.id.toString(),
    };
    const recipients = response.data.data.penerima.map((recipient: any) => ({
      value: (recipient.is_single_user ? 1 : 0) + "|" + recipient.penerima_id,
      label: recipient.name,
    }));

    const data = {
      title: response.data.data.judul,
      date: date,
      time: time,
      content: response.data.data.konten,
      room: room,
      recipients: recipients,
      isEdit: true,
      files: response.data.data.files,
    };

    setEditPengumumanData(data);

    await handleRoomChange(room);
    setMahasiswaSelectedValue(recipients);
  };

  const handleClose = () => {
    onClose();
    pengumumanForm.reset();
    setEditorData("");
    setMahasiswaSelectedValue(false);
    setEditPengumumanData(null);
  };

  const onSubmit: SubmitHandler<PengumumanData> = async (data) => {
    try {
      const formatedTime = data.date + " " + data.time;

      const formData = new FormData();
      formData.append("judul", data.title);
      formData.append("konten", editorData);
      formData.append("waktu", formatedTime);
      formData.append("room_id", data.room.toString());

      mahasiswaSelectedValue.map((recipient) => {
        formData.append("recipients[]", recipient.value);
        return recipient.value;
      });

      for (const file of data.attachment) {
        formData.append("attachment[]", file);
      }

      const apiUrl = editPengumumanData?.isEdit
        ? `http://127.0.0.1:8000/api/pengumuman/${isEdit}`
        : `http://127.0.0.1:8000/api/pengumuman`;

      const method = editPengumumanData?.isEdit ? "put" : "post";

      const response = await axios({
        method,
        url: apiUrl,
        data: formData,
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      });

      response.data.status === "success" && handleClose();

      await Swal.fire({
        icon: "success",
        title: "Success",
        customClass: {
          container: "my-swal-popup ",
        },
        text: editPengumumanData?.isEdit
          ? "Berhasil update pengumuman"
          : "Berhasil membuat pengumuman",
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          container: "my-swal-popup ",
        },
        text: editPengumumanData?.isEdit
          ? "Gagal update pengumuman"
          : "Gagal membuat pengumuman",
      });
    }
  };
  return (
    <>
      <Modal open={isModalOpen}>
        <div
          className="flex flex-col items-center justify-center h-screen no-tailwindcss-base"
          onClick={handleClose}
        >
          <div
            className="flex flex-col items-center w-full md:w-4/5  h-4/5  bg-white rounded-lg shadow-lg "
            onClick={(e) => {
              //Prevent event propagation only for this inner div
              e.stopPropagation();
            }}
          >
            <div className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
              {editPengumumanData?.isEdit
                ? "Edit Pengumuman"
                : "Add Pengumuman"}
            </div>
            <div className="w-full px-8 md:px-24 py-4 overflow-y-auto">
              <form
                onSubmit={pengumumanForm.handleSubmit(onSubmit)}
                className="flex flex-col w-full gap-4 "
              >
                <input
                  type="hidden"
                  value={roomActive}
                  {...pengumumanForm.register("room", { required: true })}
                />

                <div>
                  <label className=" text-gray-700 font-bold">Penerima</label>
                  <Controller
                    name="recipients"
                    control={pengumumanForm.control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={mahasiswaSelectedValue}
                        placeholder="Penerima :..."
                        isMulti
                        isSearchable
                        options={mahasiswaOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(value) => {
                          setMahasiswaSelectedValue(value);
                          console.log(mahasiswaSelectedValue);
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className=" text-gray-700 font-bold">Judul</label>
                  <input
                    type="text"
                    id="title"
                    required
                    defaultValue={
                      editPengumumanData?.isEdit ? editPengumumanData.title : ""
                    }
                    placeholder="Judul : ..."
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...pengumumanForm.register("title", { required: true })}
                  />
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">Waktu</label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="date"
                      id="date"
                      required
                      defaultValue={
                        editPengumumanData?.isEdit
                          ? editPengumumanData.date
                          : ""
                      }
                      className="p-2 border border-gray-300 rounded-md basis-1/2"
                      {...pengumumanForm.register("date", { required: true })}
                    />
                    <input
                      type="time"
                      id="time"
                      required
                      defaultValue={
                        editPengumumanData?.isEdit
                          ? editPengumumanData?.time
                          : ""
                      }
                      className="p-2 border border-gray-300 rounded-md basis-1/2"
                      {...pengumumanForm.register("time", { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">Konten</label>
                  <Controller
                    name="content"
                    control={pengumumanForm.control}
                    render={({ field: { onChange, value } }) => (
                      <CKEditor
                        editor={Editor}
                        config={editorConfiguration}
                        data={
                          editPengumumanData?.isEdit
                            ? editPengumumanData?.content
                            : editorData
                        }
                        onReady={(editor) => {
                          editor.plugins.get(
                            "FileRepository"
                          ).createUploadAdapter = (loader) => {
                            // Configure the URL to the upload script in your back-end here!
                            return new UploadAdapter(loader);
                          };
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setEditorData(data);
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-bold">Attachment</label>
                  <input
                    type="file"
                    id="attachment"
                    {...pengumumanForm.register("attachment")}
                    multiple={true}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    accept=".jpg,.jpeg,.png,.pdf,.zip"
                  />
                </div>
                {editPengumumanData?.isEdit &&
                  editPengumumanData.files.map((file, index) => (
                    <div key={index}>
                      <li>{file.original_name}</li>
                    </div>
                  ))}

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
          {/* </div> */}
        </div>
      </Modal>
    </>
  );
}
