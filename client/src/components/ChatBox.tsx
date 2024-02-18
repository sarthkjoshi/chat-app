"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");
interface dataType {
  handle: string;
  message: string;
}
export default function ChatBox() {
  const [message, setmessage] = useState<string>("");
  const [handle, sethandle] = useState<string>("");
  const [data, setData] = useState<dataType[]>([]);

  useEffect(() => {
    socket.on("message", (message) => {
      setData([...data, message]);
    });
  }, [data]);
  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat", { handle: handle, message: message });
      sethandle("");
      setmessage("");
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center ">
      <div className=" w-[500px] h-[500px] mt-5">
        <div className="h-full bg-slate-200 ">
          {data.map((mes, index) => {
            return (
              <p className=" text-black" key={index}>
                {mes.handle}:{mes.message}
              </p>
            );
          })}
        </div>
        <div className="flex justify-center bg-slate-700 ">
          <input
            type="text"
            className=""
            placeholder="Type handle.."
            value={handle}
            onChange={(e) => sethandle(e.target.value)}
          />
          <input
            type="text"
            className=""
            placeholder="Type message.."
            value={message}
            onChange={(e) => setmessage(e.target.value)}
          />
          <button className=" text-white" onClick={sendMessage}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
