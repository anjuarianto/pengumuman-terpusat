"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { TableContainer, Paper, Tooltip, Modal, Button } from "@mui/material";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import axios from "axios";
import Cookies from "js-cookie";

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

const dummyData = [
  {
    id: 1,
    mahasiswa: "John Doe",
    date: "13 February 2023, 8:56",
    content:
      "Market basket analysis merupakan salah satu teknik data mining yang dimana menganalisa suatu pola dari hubungan antar item. misalnya untuk menganalisa suatu produk makanan di salah satu fastfood untuk memprediksi apakah item pembelian makanan dan minuman tertentu cukup besar, yang nantinya dapat memprediksi dengan menyediakan paket makanan dan minuman. Untuk perhitungan secara matematikanya yaitu dengan ukuran Minimal Support merupakan suatu ukuran atau nilai yang harus dipenuhi sebagai batasan besar frekuensi kejadian dari seluruh nilai dominasi suatu item atau itemset dalam keseluruhan transaksi dengan Support (X, y) = jumlah transaksi yang mengandung x dan y dibagi total transaksinya. kemudian menghitung Minimal Confidence merupakan parameter yang mendefinisikan minimum level suatu nilai hubungan antar item(confidence) yang harus dipenuhi agar menemukan aturan yang berkualitas.",
    
  },
  {
    id: 2,
    mahasiswa: "Jane Smith",
    date: "15 March 2024, 14:12", // Different date for each object
    content: "This is some <em>dummy content</em> for mahasiswa Jane Smith.",
    
  },
  {
    id: 3,
    mahasiswa: "Michael Chen",
    date: "07 January 2024, 10:30",
    content: "This is some plain dummy content for mahasiswa Michael Chen.",
    
  },
  {
    id: 4,
    mahasiswa: "Alice Garcia",
    date: "29 October 2023, 17:55",
    content:
      "Here's another example with <b>bold</b> text for mahasiswa Alice Garcia.",
    
  },
  {
    id: 5,
    mahasiswa: "David Kim",
    date: "02 December 2023, 09:28",
    content: "<i>This content is italicized</i> for mahasiswa David Kim.",
    
  },
];

type Pengumuman = {
  id: number;
  judul: string;
  konten: string;
  waktu: string;
  room: { id: number; name: string };
  created_by: string;
};

export default function Pengumuman({
  params,
}: {
  params: { pengumumanid: string };
}) {
  const pid = params.pengumumanid;
  const router = useRouter();
  const [openAddComment, setOpenAddComment] = useState(false);
  const [editorData, setEditorData] = useState<string>("");
  const [pengumuman, setPengumuman] = useState<Pengumuman>({
    id: 0,
    judul: "",
    konten: "",
    waktu: "",
    room: { id: 0, name: "" },
    created_by: "",
  });

  const replyForm = useForm<{ content: string }>();

  useEffect(() => {
    tokenCheck().then(() => {
      loadPengumumanData();
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
        `http://127.0.0.1:8000/api/pengumuman/${pid}`,

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

  const handleGoBack = () => {
    router.back(); // Navigate to previous route
  };
  const onSubmit: SubmitHandler<{content:string}> = async (data) => {
    try{
      console.log(editorData)
      console.log("^^^^^^^^^^^^^^^^^^^data")
    }catch(err){
        console.log(err)
    }
  }
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
                      <FaAngleLeft />
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
                className="py-2"
                dangerouslySetInnerHTML={{ __html: pengumuman.konten }}
              />
              {!openAddComment ? (
                <div className="flex flex-row gap-4 text-sm">
                  <Button
                    variant="outlined"
                    startIcon={<FaPlus />}
                    onClick={() => setOpenAddComment(true)}
                  >
                    Add Comment
                  </Button>
                </div>
              ) : (
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
                    <Button variant="contained" type="submit">Submit</Button>
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
              {dummyData.map((data) => (
                <div
                  key={data.id}
                  className="flex flex-col gap-2 p-2 rounded-lg border "
                >
                  <div className="flex flex-row items-center gap-2 text-sm justify-between">
                    <div className="flex flex-row gap-2 items-center ">
                      <span className="font-bold">{data.mahasiswa}</span>
                      <span className="text-main-3">{data.date}</span>
                    </div>
                  </div>

                  <p
                    className="py-2"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
