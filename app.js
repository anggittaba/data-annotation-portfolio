// Annotation studio — vanilla JS, no dependencies.
(function () {
  "use strict";

  var IMAGES = {
    street: "assets/street.webp",
    shelf: "assets/shelf.webp",
    fruit: "assets/fruit.webp"
  };

  var SAMPLES = {
    street: [
      { x: 0.06, y: 0.48, w: 0.24, h: 0.34, label: "car" },
      { x: 0.58, y: 0.42, w: 0.09, h: 0.38, label: "person" },
      { x: 0.72, y: 0.52, w: 0.20, h: 0.30, label: "car" }
    ],
    shelf: [
      { x: 0.08, y: 0.22, w: 0.16, h: 0.42, label: "box" },
      { x: 0.48, y: 0.32, w: 0.09, h: 0.38, label: "bottle" },
      { x: 0.74, y: 0.26, w: 0.13, h: 0.36, label: "box" }
    ],
    fruit: [
      { x: 0.28, y: 0.52, w: 0.13, h: 0.24, label: "apple" },
      { x: 0.54, y: 0.58, w: 0.20, h: 0.16, label: "banana" },
      { x: 0.76, y: 0.46, w: 0.11, h: 0.20, label: "apple" }
    ]
  };

  var state = {
    image: "street",
    boxes: { street: [], shelf: [], fruit: [] },
    selected: -1,
    drawing: null
  };

  var stage = document.getElementById("stage");
  var stageImg = document.getElementById("stageImg");
  var overlay = document.getElementById("overlay");
  var labelInput = document.getElementById("labelInput");
  var boxList = document.getElementById("boxList");
  var boxCount = document.getElementById("boxCount");
  var jsonOut = document.getElementById("jsonOut");

  function boxes() { return state.boxes[state.image]; }

  function fracPos(e) {
    var r = overlay.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    };
  }

  function render() {
    overlay.innerHTML = "";
    var list = boxes();
    list.forEach(function (b, i) {
      var d = document.createElement("div");
      d.className = "ann-box" + (i === state.selected ? " selected" : "");
      d.style.left = b.x * 100 + "%";
      d.style.top = b.y * 100 + "%";
      d.style.width = b.w * 100 + "%";
      d.style.height = b.h * 100 + "%";
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = b.label;
      d.appendChild(tag);
      d.dataset.index = i;
      overlay.appendChild(d);
    });
    renderList();
    boxCount.textContent = list.length;
  }

  function renderList() {
    var list = boxes();
    boxList.innerHTML = "";
    if (!list.length) {
      var li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No boxes yet. Draw one on the image, or load a sample below.";
      boxList.appendChild(li);
      return;
    }
    list.forEach(function (b, i) {
      var li = document.createElement("li");
      if (i === state.selected) li.className = "selected";
      var name = document.createElement("span");
      name.textContent = (i + 1) + ". " + b.label;
      var del = document.createElement("button");
      del.className = "del";
      del.textContent = "\u00d7";
      del.setAttribute("aria-label", "Delete box " + (i + 1));
      del.addEventListener("click", function (ev) {
        ev.stopPropagation();
        removeBox(i);
      });
      li.appendChild(name);
      li.appendChild(del);
      li.addEventListener("click", function () {
        state.selected = i;
        render();
      });
      boxList.appendChild(li);
    });
  }

  function removeBox(i) {
    boxes().splice(i, 1);
    if (state.selected === i) state.selected = -1;
    else if (state.selected > i) state.selected--;
    render();
  }

  overlay.addEventListener("pointerdown", function (e) {
    var hit = e.target.closest(".ann-box");
    if (hit && hit.dataset.index !== undefined) {
      state.selected = parseInt(hit.dataset.index, 10);
      render();
      return; // selecting, not drawing
    }
    var p = fracPos(e);
    state.drawing = { x0: p.x, y0: p.y, x1: p.x, y1: p.y, el: null };
    overlay.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  overlay.addEventListener("pointermove", function (e) {
    if (!state.drawing) return;
    var p = fracPos(e);
    state.drawing.x1 = p.x;
    state.drawing.y1 = p.y;
    var d = state.drawing;
    if (!d.el) {
      d.el = document.createElement("div");
      d.el.className = "ann-box drawing";
      overlay.appendChild(d);
    }
    var x = Math.min(d.x0, d.x1), y = Math.min(d.y0, d.y1);
    var w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0);
    d.el.style.left = x * 100 + "%";
    d.el.style.top = y * 100 + "%";
    d.el.style.width = w * 100 + "%";
    d.el.style.height = h * 100 + "%";
  });

  overlay.addEventListener("pointerup", function (e) {
    if (!state.drawing) return;
    var d = state.drawing;
    state.drawing = null;
    if (d.el) d.el.remove();
    var x = Math.min(d.x0, d.x1), y = Math.min(d.y0, d.y1);
    var w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0);
    if (w < 0.015 || h < 0.015) { render(); return; } // too small = click, ignore
    var label = (labelInput.value || "").trim() || "object";
    boxes().push({ x: x, y: y, w: w, h: h, label: label });
    state.selected = boxes().length - 1;
    jsonOut.hidden = true;
    render();
  });

  overlay.addEventListener("pointercancel", function () {
    if (state.drawing && state.drawing.el) state.drawing.el.remove();
    state.drawing = null;
    render();
  });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement && document.activeElement.tagName);
    if (typing) return;
    if ((e.key === "Delete" || e.key === "Backspace") && state.selected >= 0) {
      e.preventDefault();
      removeBox(state.selected);
    }
  });

  // image switching
  document.querySelectorAll(".thumb").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".thumb").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      state.image = btn.dataset.img;
      state.selected = -1;
      stageImg.src = IMAGES[state.image];
      stageImg.alt = btn.querySelector("span").textContent + " sample";
      jsonOut.hidden = true;
      render();
    });
  });

  // quick label chips
  document.getElementById("chips").addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    labelInput.value = chip.textContent;
    labelInput.focus();
  });

  document.getElementById("sampleBtn").addEventListener("click", function () {
    state.boxes[state.image] = SAMPLES[state.image].map(function (b) {
      return { x: b.x, y: b.y, w: b.w, h: b.h, label: b.label };
    });
    state.selected = -1;
    jsonOut.hidden = true;
    render();
  });

  document.getElementById("clearBtn").addEventListener("click", function () {
    state.boxes[state.image] = [];
    state.selected = -1;
    jsonOut.hidden = true;
    render();
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    var list = boxes();
    var out = {
      image: state.image + ".webp",
      boxes: list.map(function (b) {
        return {
          label: b.label,
          bbox: [
            Math.round(b.x * 1000) / 1000,
            Math.round(b.y * 1000) / 1000,
            Math.round(b.w * 1000) / 1000,
            Math.round(b.h * 1000) / 1000
          ],
          note: "bbox as normalized [x, y, width, height]"
        };
      })
    };
    jsonOut.textContent = JSON.stringify(out, null, 2);
    jsonOut.hidden = false;
    jsonOut.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  render();
})();
