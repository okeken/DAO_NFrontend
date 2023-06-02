import React, { Fragment } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

import { useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { SearchIcon } from '@/icons';
import { useAccount } from 'wagmi';
import { Button } from '../core';
import moment from 'moment';

const LOCK_HEAD = [
    "Proposal Name",
    "Deadline",
    "Action"
];

const useStyles = makeStyles((theme) =>
    createStyles({
        famFont: {
            fontFamily: 'Inter sans-serif',
        }
    })
);

const EnhancedTableHead = (props: any) => {
    const classes = useStyles();
    return (
        <TableHead>
            <TableRow
                sx={{
                    "td, th": { borderColor: "#DFE4F4", background: "#FAFAFA" },
                }}
            >
                {LOCK_HEAD.map((data, i) => (
                    <TableCell
                        key={i}
                        sx={{
                            px: "30px",
                            py: "13px",
                        }}
                        className={classes.famFont}
                    >
                        <h1 className="font-medium text-[12px] leading-[18px] text-[#70707B]">
                            {data}
                        </h1>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const VoteTable = ({ proposals, handleClick, balance, symbol }: any) => {
    const classes = useStyles();
 
    return (
        <div className="bg-white font-inter rounded-lg mx-3">

            <div className="px-4 py-3 flex items-center justify-between">
                <div className="relative">
                    <input
                        type="text"
                        placeholder='Find'
                        className='w-full sm:w-[300px] placeholder:text-[#70707B] border border-[#D1D1D6] pl-[42px] pr-2 py-2 rounded-[12px]'
                    />
                    <div className="absolute top-2 sm:top-3 left-4">
                        <SearchIcon />
                    </div>
                </div>

                <div className="flex ml-4 bg-white py-2 text-[#EF4444] text-sm px-4 border border-[#EF4444] rounded-[12px]">
                    <div className="">{balance ?? "0.0"}</div>
                    <div className="text-sm ml-1">{symbol}</div>
                </div>
            </div>

            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: "transparent",
                    boxShadow: "none",
                    // borderRadius: "10px",
                    borderColor: "none",
                    borderWidth: 0,
                    width: "100%",
                    overflowX: "auto",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <EnhancedTableHead />
                    <TableBody>
                        {Array.isArray(proposals) && proposals.length > 0 ? (
                            proposals?.map((proposal: any, _i: number) => {
                                    const endDateEpoch = Number(String(proposal?.endTime)) * 1000;
                                    const currentDate = Date.now();

                                    return (
                                        <TableRow
                                            tabIndex={-1}
                                            key={_i}
                                            sx={{
                                                "&:last-child td, &:last-child th": { border: 0 },
                                                "td, th": { borderColor: "#DFE4F4" },
                                            }}
                                        >
                                            {!proposal?.cancelled && currentDate < endDateEpoch && (
                                                <Fragment>
                                                    <TableCell
                                                        sx={{
                                                            py: "18px",
                                                            px: "30px",
                                                        }}
                                                        className={classes.famFont}
                                                    >
                                                        <div className="flex gap-x-3 items-center">
                                                            <h1 className="font-medium text-sm text-[#18181B]">
                                                                {proposal?.name}
                                                            </h1>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            py: "18px",
                                                            px: "30px",
                                                        }}
                                                        className={classes.famFont}
                                                    >
                                                        {proposal?.cancelled ? (
                                                            <p className="bg-[#FDF4FF] inline px-4 py-1 border border-[#F6D0FE] text-[#70707B] rounded-[8px]">
                                                                Cancelled
                                                            </p>
                                                        ) : currentDate > endDateEpoch ? (
                                                            <div className="text-[#70707B]">
                                                                <div className="">
                                                                    {moment(new Date(Number(proposal?.endTime)) as any).format('MMMM Do, YYYY')}
                                                                </div>
                                                                <div className="">
                                                                    [{moment(new Date(Number(proposal?.endTime)) as any).format('h:mm:ss A')}]
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-[#70707B]">
                                                                <div className="">
                                                                    {moment(new Date(Number(proposal?.endTime)) as any).format('MMMM Do, YYYY')}
                                                                </div>
                                                                <div className="">
                                                                    [{moment(new Date(Number(proposal?.endTime)) as any).format('h:mm:ss A')}]
                                                                </div>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            py: "18px",
                                                            px: "30px",
                                                        }}
                                                        className={classes.famFont}
                                                    >
                                                        <div className="flex">
                                                            <Button
                                                                onClick={() => handleClick(_i + 1, 1)}
                                                                type='button'
                                                                className="bg-[#0F2A49] text-white py-1 px-4 rounded-[12px]"
                                                            >
                                                                Support
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleClick(_i + 1, 0)}
                                                                type='button'
                                                                className="bg-[#F04438] ml-2 text-white py-1 px-4 rounded-[12px]"
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>

                                                    </TableCell>
                                                </Fragment>
                                            )}
                                        </TableRow>
                                    );
                                })
                        ) : (
                            <TableCell
                                colSpan={5}
                                sx={{
                                    py: "18px",
                                    px: "30px",
                                }}
                            >
                                <div className="text-center">No proposal found!</div>
                            </TableCell>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export { VoteTable as default }