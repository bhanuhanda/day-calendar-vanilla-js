import "./styles.css";

const rootEl = document.getElementById("app");
rootEl.style.position = "relative";
rootEl.style.width = "100%";

const data = [
  {
    title: "# Meeting with Karl",
    startTime: "Sat Jan 01 2022 02:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 05:30:00 GMT+0530"
  },
  {
    title: "# Planning Meeting",
    startTime: "Sat Jan 01 2022 01:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 04:30:00 GMT+0530"
  },
  {
    title: "# Sprint Dicsussion",
    startTime: "Sat Jan 01 2022 03:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 05:00:00 GMT+0530"
  },
  {
    title: "# Pre Sales QD",
    startTime: "Sat Jan 01 2022 07:20:00 GMT+0530",
    endTime: "Sat Jan 01 2022 08:40:00 GMT+0530"
  },
  {
    title: "# Funnel CMS Discussion",
    startTime: "Sat Jan 01 2022 06:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 08:40:00 GMT+0530"
  },
  {
    title: "# Tech Leads Meet",
    startTime: "Sat Jan 01 2022 12:20:00 GMT+0530",
    endTime: "Sat Jan 01 2022 14:40:00 GMT+0530"
  },
  {
    title: "# FE Design Meet",
    startTime: "Sat Jan 01 2022 12:20:00 GMT+0530",
    endTime: "Sat Jan 01 2022 14:40:00 GMT+0530"
  },
  {
    title: "# Feature Roll out",
    startTime: "Sat Jan 01 2022 17:40:00 GMT+0530",
    endTime: "Sat Jan 01 2022 20:00:00 GMT+0530"
  },
  {
    title: "# WaterCooler Chat",
    startTime: "Sat Jan 01 2022 19:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 20:30:00 GMT+0530"
  },
  {
    title: "# Book Time",
    startTime: "Sat Jan 01 2022 23:00:00 GMT+0530",
    endTime: "Sat Jan 01 2022 23:59:00 GMT+0530"
  }
];

for (let i = 0; i < 24; i += 1) {
  const el = document.createElement("div");
  let num = i < 10 ? "0" + i : "" + i;
  el.innerHTML = num + ":00";

  el.style.cssText = `
    width: 100%;
    padding-left: 0.5rem;
    border-top: 1px dashed #bbb;
  `;
  el.style.position = "absolute";
  el.style.top = `${60 * i}px`;

  rootEl.appendChild(el);
}

data.sort(
  (a, b) => new Date(a.startTime).getHours() - new Date(b.startTime).getHours()
);

const getBgColr = (hour) => {
  if (hour < 6) return "#9a9a9a";
  if (hour < 12) return "#68bb59";
  else if (hour < 18) return "#ffa500";
  else return "#1aa7ec";
};

const overlappings = [];
let overlapped = false;

for (let i = 0; i < data.length; i += 1) {
  const eventStartHour = new Date(data[i].startTime).getHours();
  const eventStartMins = new Date(data[i].startTime).getMinutes();
  const eventEndHour = new Date(data[i].endTime).getHours();
  const eventEndMins = new Date(data[i].endTime).getMinutes();

  const el = document.createElement("div");

  el.style.cssText = `
    border: 2px solid #000;
    border-radius: 9px;
    width: 80%;
    right: 0;
    padding: 0.5rem;
  `;

  el.style.position = "absolute";
  el.style.top = `${60 * eventStartHour + eventStartMins}px`;
  el.style.height = `${
    60 * (eventEndHour - (eventStartHour + 1)) +
    (60 - eventStartMins) +
    eventEndMins
  }px`;
  el.style.background = getBgColr(eventEndHour);

  const elHeading = document.createElement("h5");
  const elData = document.createElement("p");

  elHeading.innerHTML = data[i].title;
  elData.innerHTML = `
    ${eventStartHour < 10 ? "0" + eventStartHour : "" + eventStartHour}:${
    eventStartMins < 10 ? "0" + eventStartMins : "" + eventStartMins
  } -
    ${eventEndHour < 10 ? "0" + eventEndHour : "" + eventEndHour}:${
    eventEndMins < 10 ? "0" + eventEndMins : "" + eventEndMins
  }
  `;

  el.appendChild(elHeading);
  el.appendChild(elData);
  rootEl.appendChild(el);

  const dimensions = el.getBoundingClientRect();

  if (overlappings.length === 0) {
    overlappings.push({
      pos: 1,
      top: dimensions.top,
      bottom: dimensions.bottom
    });
  } else {
    for (let j = 0; j < overlappings.length; j++) {
      if (
        (overlappings[j].top <= dimensions.top &&
          overlappings[j].bottom >= dimensions.bottom) ||
        (overlappings[j].top <= dimensions.top &&
          overlappings[j].bottom <= dimensions.bottom &&
          overlappings[j].bottom > dimensions.top)
      ) {
        overlappings[j] = {
          pos: (overlappings[j].pos += 1),
          top: Math.min(overlappings[j].top, dimensions.top),
          bottom: Math.max(overlappings[j].bottom, dimensions.bottom)
        };
        el.style.width = `${parseInt(100 / overlappings[j].pos, 10)}%`;
        overlapped = true;
        break;
      }
    }
    if (!overlapped) {
      overlappings.push({
        pos: 1,
        top: dimensions.top,
        bottom: dimensions.bottom
      });
    }
    overlapped = false;
  }
}
