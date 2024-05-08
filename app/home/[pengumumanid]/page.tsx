"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { TableContainer, Paper, Tooltip, Modal, Button } from "@mui/material";
import { FaAngleLeft, FaPlus,FaAngleRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

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

type Pengumuman = {
  id: number;
  judul: string;
  konten: string;
  waktu: string;
  room: { id: number; name: string };
  files: { file: string; original_name: string }[];
  created_by: string;
};
type Comments = {
  id: number;
  pengumuman_id: number;
  user_id: number;
  name: string;
  comment: string;
  waktu: string;
  created_at: string;
  updated_at: string;
};

export default function Pengumuman({
  params,
}: {
  params: { pengumumanid: string };
}) {
  const pid = params.pengumumanid;
  const router = useRouter();
  const [openAddComment, setOpenAddComment] = useState(false);
  const [openEditComment, setOpenEditComment] = useState<{
    reply_id: number;
    isOpen: boolean;
  }>();
  const [editorData, setEditorData] = useState<string>("");
  const [userID, setUserID] = useState<number>();
  const [pengumuman, setPengumuman] = useState<Pengumuman>({
    id: 0,
    judul: "",
    konten: "",
    waktu: "",
    room: { id: 0, name: "" },
    files: [],
    created_by: "",
  });

  const [comments, setComments] = useState<Comments[]>([
    {
      id: 0,
      pengumuman_id: 0,
      user_id: 0,
      name: "",
      comment: "",
      waktu: "",
      created_at: "",
      updated_at: "",
    },
  ]);

  const replyForm = useForm<{ content: string }>();

  useEffect(() => {
    tokenCheck().then(() => {
      loadPengumumanData();
      loadCommentsData();
      loadUserID();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  const tokenCheck = async () => {
    try {
      const accToken = Cookies.get("accessToken");
      if (!accToken || accToken.length == 0) {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadPengumumanData = async () => {
    try {
      const response = await axios.get(
        `/api/pengumuman/${pid}`,

        {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      const pengumumanData: Pengumuman = response.data.data;
      setPengumuman(pengumumanData);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUserID = async () => {
    try {
      const response = await axios.get(
        `/api/me`,

        {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      const uid: number = response.data.id;
      setUserID(uid);

      console.log(uid);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCommentsData = async () => {
    try {
      const response = await axios.get(
        `/api/pengumuman/${pid}/reply`,

        {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      // const commentsData: Comments = response.data.data;

      const convertedData: Comments[] = response.data.data.map(
        (comment: any) => ({
          ...comment,
          created_at: new Date(comment.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          updated_at: new Date(comment.updated_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        })
      );

      setComments(convertedData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoBack = () => {
    router.back(); // Navigate to previous route
  };
  const onSubmit: SubmitHandler<{ content: string }> = async (data) => {
    try {
      const cleanData = openEditComment?.isOpen
        ? { comment: editorData }
        : { pengumuman_id: pid, user_id: userID, comment: editorData };

      const apiUrl = openEditComment?.isOpen
        ? `/api/pengumuman/${pid}/reply/${openEditComment.reply_id}`
        : `/api/pengumuman/${pid}/reply`;

      const method = openEditComment?.isOpen ? "PUT" : "POST";

      const response = await axios({
        method,
        url: apiUrl,
        data: cleanData,
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        customClass: {
          container: "my-swal-popup ",
        },
        text: "Successful!",
      });
      loadCommentsData();
      setEditorData("")
      setOpenAddComment(false)
      setOpenEditComment({isOpen:false, reply_id:0})
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          container: "my-swal-popup ",
        },
        text: "Failed",
      });
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const tag = document.createElement("a");
      tag.target = "_blank";
      tag.href = `/storage/pengumuman/${fileUrl}`;
      tag.setAttribute("download", fileName);
      document.body.appendChild(tag);
      tag.click();
      tag.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle download error gracefully, e.g., display an error message to the user
    }
  };


  const deleteComment = (replyID: number) => {
    Swal.fire({
      title: `Delete comment ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const apiUrl = `/api/pengumuman/${pid}/reply/${replyID}`;
        await axios
          .delete(apiUrl, {
            headers: {
              Authorization: "Bearer " + Cookies.get("accessToken"),
            },
          })
          .then(async (response) => {
            await Swal.fire("Deleted!", response.data.message, "success");
          })
          .then(async () => {
            loadCommentsData();
          })
          .catch((error) => {
            Swal.fire("Gagal", "Gagal menghapus user", "error");
          });
        console.log(apiUrl);
      }
    });
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center w-full h-full pt-16 ">
        <div className="flex flex-col  w-full h-screen px-12">
          <div className="w-full h-fit p-2 bg-white rounded-lg hover:cursor-default">
            <div className="flex flex-col gap-2 p-2 rounded-lg ">
              <div className="flex flex-row items-center gap-2 text-sm justify-between">
                <div className="flex flex-row gap-4 items-center ">
                  <Tooltip title="Back to home" placement="top" arrow>
                    <button
                        className="p-3  rounded-lg  bg-white hover:bg-dark-blue-h hover:text-white border border-dark-blue-h"
                        onClick={handleGoBack}
                    >
                      <FaAngleLeft/>
                    </button>
                  </Tooltip>
                  <span>• {pengumuman.created_by}</span>{" "}
                  <span className="text-main-3">{pengumuman.waktu} </span>
                </div>

                <span className="float-right bg-orange text-white rounded-2xl p-2">
                  {pengumuman.room.name}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{pengumuman.judul}</h1>

              <p
                  className="py-2 my-editor"
                  dangerouslySetInnerHTML={{__html: pengumuman.konten}}
              />

              <div>
                <h2>Attachment : </h2>
                {pengumuman.files.map((file, index) => (
                    <div key={index}>
                      <button
                          className="flex flex-row items-center cursor-pointer"
                          onClick={() =>
                              handleDownload(file.file, file.original_name)
                          }
                      >
                        <FaAngleRight/>
                        {file.original_name}
                      </button>
                    </div>
                ))}
              </div>
              <div>
                {pengumuman.files.map((file, index) => (
                    <div key={index} className="flex flex-col gap-2 text-center">
                      {file.original_name.match(/\.(png|jpg|jpeg|gif)$/i) && (
                          <div>
                            <img
                                src={`/storage/pengumuman/${file.file}`}
                                alt={`${file.original_name}`}
                            />
                            <h1>{file.original_name}</h1>
                          </div>
                      )}
                    </div>
                ))}
              </div>
              {!openAddComment ? (
                  <div className="flex flex-row gap-4 text-sm">
                    <Button
                        variant="outlined"
                        startIcon={<FaPlus/>}
                        onClick={() => {
                          setOpenAddComment(true),
                              setOpenEditComment({reply_id: 0, isOpen: false});
                        }}
                    >
                      Add Comment
                    </Button>
                  </div>
              ) : (
                  <form onSubmit={replyForm.handleSubmit(onSubmit)}>
                    <Controller
                        name="content"
                        control={replyForm.control}
                        render={({field: {onChange, value}}) => (
                            <CKEditor
                                editor={Editor}
                                config={editorConfiguration}
                                data={""}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  setEditorData(data);
                                }}
                            />
                        )}
                    />

                    <div className="flex flex-row gap-4 py-4">
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                      <Button
                          variant="contained"
                          color="error"
                          onClick={() => setOpenAddComment(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
              )}
            </div>
          </div>

          {/* comments */}
          <div className="w-full h-fit my-4 pl-8 pr-4 py-2 bg-white rounded-lg hover:cursor-default">
            <h1 className="font-bold text-xl">Comments</h1>

            <div className="flex flex-col gap-4">
              {comments.map((data) => (
                  <div
                      key={data.id}
                      className="flex flex-col gap-2 p-2 rounded-lg border "
                  >
                    <div className="flex flex-row items-center gap-2 text-sm justify-between">
                      <div className="flex flex-row gap-2 items-center ">
                        <span className="font-bold">{data.name}</span>
                        <span className="text-main-3">{data.updated_at}</span>
                      </div>
                    </div>

                    <p
                        className="py-2"
                        dangerouslySetInnerHTML={{__html: data.comment}}
                    />
                    {data.user_id === userID && (
                        <div className="flex flex-row gap-4">
                          <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                          setOpenEditComment({
                            reply_id: data.id,
                            isOpen: true,
                          }),
                            setOpenAddComment(false);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => deleteComment(data.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                  {openEditComment?.isOpen &&
                    data.user_id === userID &&
                    data.id === openEditComment?.reply_id && (
                      <form onSubmit={replyForm.handleSubmit(onSubmit)}>
                        <Controller
                          name="content"
                          control={replyForm.control}
                          render={({ field: { onChange, value } }) => (
                            <CKEditor
                              editor={Editor}
                              config={editorConfiguration}
                              data={""}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                              }}
                            />
                          )}
                        />

                        <div className="flex flex-row gap-4 py-4">
                          <Button
                            size="small"
                            variant="contained"
                            type="submit"
                          >
                            Submit
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              setOpenEditComment({ reply_id: 0, isOpen: false })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
