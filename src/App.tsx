import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { useState } from "react";
import ReactLinkify from "react-linkify";
import "./App.css";
// import { Grid, Input } from "@chakra-ui/react";
import { db } from "./database";
console.log(db);
function App() {
  const [inputLog, setInputLog] = useState("");
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
        timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
      });
      setInputLog("");
      alert(`Log added with id ${id}`);
    } catch (err) {
      alert("error");
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>Your Logs at One Place</h1>
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          onChange={(e) => {
            setInputLog(e.target.value);
          }}
          value={inputLog}
          width="100%"
          placeholder="Write and Enter"
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
              <div className="log-time">{log.timestamp}</div>
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
