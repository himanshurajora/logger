import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactLinkify from "react-linkify";
import "./App.css";
import { LOGGER_TIME_FORMAT } from "./constants";
// import { Grid, Input } from "@chakra-ui/react";
import { db } from "./database";

function App() {
  const [inputLog, setInputLog] = useState("");
  const [, setNotificationPermission] = useState(false);
  const logs = useLiveQuery(() => {
    return db.logs.orderBy("id").reverse().limit(50).toArray();
  });
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputLog.length === 0) return;
    try {
      const id = await db.logs.add({
        message: inputLog,
        tag: "untagged",
        timestamp: moment().format(LOGGER_TIME_FORMAT),
      });
      setInputLog("");
      alert(`Log added with id ${id}`);
    } catch (err) {
      alert("error");
      console.log(err);
    }
  };

  const sendRemindLogNotification = () => {
    sendNotification({
      title: "Logger Notification",
      body: "Don't forget to log your time!",
      icon: "⌚",
    });
  };

  useEffect(() => {
    let notificationInterval: NodeJS.Timer;
    isPermissionGranted().then(async (permission) => {
      if (!permission) {
        permission = (await requestPermission()) === "granted";
      }
      if (permission) {
        sendRemindLogNotification();
        notificationInterval = setInterval(() => {
          sendRemindLogNotification();
        }, 1000 * 60 * 5);
      }
      setNotificationPermission(permission);
    });

    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  // auto focus on window focus
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (!(document.getElementById("input-log") === document.activeElement))
        if (e.key === " ") document.getElementById("input-log")?.focus();
    });

    return () => window.removeEventListener("keydown", () => {});
  }, []);

  return (
    <div className="App">
      <h1>Your Logs at One Place </h1>
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          onChange={(e) => {
            setInputLog(e.target.value);
          }}
          value={inputLog}
          width="100%"
          placeholder="Write and Enter"
          id="input-log"
          autoFocus
        />
      </form>
      <div className="logs">
        {logs?.map((log) => {
          return (
            <div className="log" key={log.id}>
              <div className="log-message">
                <ReactLinkify>{log.message}</ReactLinkify>
              </div>
              {/* <div className="log-status">{log.tag}</div> */}
              <div className="log-time">
                {moment(log.timestamp, LOGGER_TIME_FORMAT).fromNow()} -{" "}
                {log.timestamp}
              </div>
            </div>
          );
        })}
      </div>
      <p
        style={{
          padding: "30px",
          margin: "20px 0px",
          background: "rgb(227, 227, 227)",
        }}
      >
        Made by Vedik Dev{" "}
        <a href="https://github.com/himanshurajora">Himanshu Jangid</a>
      </p>
    </div>
  );
}

export default App;
