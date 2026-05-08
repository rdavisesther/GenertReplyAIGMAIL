function requestAI(prompt, callback) {

  var xhr = new XMLHttpRequest();

  xhr.open("POST", API_URL, true);

  xhr.setRequestHeader(
    "Content-Type",
    "application/json"
  );

  xhr.onreadystatechange = function () {

    if (xhr.readyState === 4) {

      var responseText = xhr.responseText || "";

      // EMPTY RESPONSE
      if (!responseText) {

        callback(
          "Empty server response.",
          null
        );

        return;
      }

      var data = null;

      try {

        data = JSON.parse(responseText);

      } catch (e) {

        console.log("RAW RESPONSE:", responseText);

        callback(
          "Server returned invalid JSON.",
          null
        );

        return;
      }

      // API ERROR
      if (
        xhr.status !== 200 ||
        (data && data.error)
      ) {

        callback(
          data.error || "API error",
          null
        );

        return;
      }

      // SUCCESS
      callback(
        null,
        data.reply || ""
      );
    }
  };

  xhr.onerror = function () {

    callback(
      "Network error.",
      null
    );
  };

  xhr.send(
    JSON.stringify({
      prompt: prompt
    })
  );
}

