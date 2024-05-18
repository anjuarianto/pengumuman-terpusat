import {Button} from "@mui/material";
import React from "react";

type PaginationProps = {
    meta: { currentPage: number; lastPage: number };
    setMeta: (meta: { currentPage: number; lastPage: number }) => void;
    reload: () => void;
};
export default function Pagination({meta, setMeta, reload}: PaginationProps) {

    const handlePageChange = (pageNumber: any) => {
        setMeta({ ...meta, currentPage: pageNumber });
        reload();
    };

    return (
        <div className="flex justify-center mt-4">
            <Button
                disabled={meta.currentPage === 1}
                onClick={() => handlePageChange(meta.currentPage - 1)}
                variant="contained"
                color="primary"
                className="mr-2"
            >
                Previous
            </Button>
            <div className="flex gap-2">
                {meta.currentPage != 1 && (
                    <div
                        className="px-4 py-2 rounded-md  m-auto text-white bg-slate-700 transition cursor-default hover:cursor-default hover:bg-sky-600"
                        onClick={() => {
                            handlePageChange(1);
                        }}
                    >
                        1
                    </div>
                )}

                {meta.currentPage != 1 && meta.currentPage != 2 && (
                    <div className="px-4 py-2 rounded-md  m-auto text-white border-sky-600 bg-slate-700" onClick={() => {
                        handlePageChange(meta.currentPage - 1);
                    }}>
                        {meta.currentPage - 1}
                    </div>
                )}

                <div className="px-4 py-2 rounded-md  m-auto text-white border-2 border-sky-600 bg-slate-700" >
                    {meta.currentPage}
                </div>
                {meta.currentPage != meta.lastPage && meta.currentPage != meta.lastPage-1 && (
                    <div className="px-4 py-2 rounded-md  m-auto text-white  border-sky-600 bg-slate-700 cursor-default hover:cursor-default hover:bg-sky-600" onClick={() => {
                        handlePageChange(meta.currentPage + 1);
                    }}>
                        {meta.currentPage + 1}
                    </div>
                )}

                {meta.currentPage != meta.lastPage && (
                    <div
                        className="px-4 py-2 rounded-md  m-auto text-white bg-slate-700 transition cursor-default hover:cursor-default hover:bg-sky-600"
                        onClick={() => {
                            handlePageChange(meta.lastPage);
                        }}
                    >
                        7
                    </div>
                )}
            </div>
            <Button
                disabled={meta.currentPage === meta.lastPage}
                onClick={() => handlePageChange(meta.currentPage + 1)}
                variant="contained"
                color="primary"
                className="ml-2"
            >
                Next
            </Button>
        </div>
    );
}