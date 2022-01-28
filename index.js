import "./style.css";

import copy from "copy-to-clipboard";

function reset() {
  const elementsToHide = [
    "#submit-form",
    "#success-card",
    "#redirecting-text",
    "#some-issue",
  ];

  elementsToHide.forEach((el) => {
    if (!$(el).hasClass("d-none")) {
      $(el).addClass("d-none");
    }
  });

  $("#submit-btn").removeAttr("disabled");
}

function home() {
  reset();
  $("#submit-form").removeClass("d-none");
}

function success() {
  reset();
  if ($("#shortened-div").text().length <= 0) {
    page.redirect("/");
  }
  $("#success-card").removeClass("d-none");
}

function wildCard(ctx) {
  reset();
  $("#redirecting-text").removeClass("d-none");

  const shortURL = ctx.params.shortcode;

  $.post(
    "/api/getlongurl",
    {
      shortURL,
    },
    (data) => {
      $("#redirected-link-text").html(
        `<div class="text-info">
            If not redirected, <a href="${data.longURL}">click me</a>
          </div>.`
      );
      window.location.replace(data.longURL);
    }
  ).fail(() => {
    $("#redirected-link-text").html(
      `<div class="text-warning">
          There was some issue, maybe the shortcode is incorrect. 
          <a href="./" style="color: inherit;">Go to Home</a>
        </div>.`
    );
  });
}

function someIssue() {
  reset();
  $("#some-issue").removeClass("d-none");
}

function docs() {
  reset();
  window.location.replace("https://github.com/KrishGarg/url-shortner/wiki/API-Routes");
}

page("/", home);
page("/success", success);
page("/oops", someIssue);
page("/docs", docs);
page("/:shortcode", wildCard);
page();

$(() => {
  $("#submit-form").on("submit", (e) => {
    e.preventDefault();

    $("#submit-btn").attr("disabled", true);

    $.post(
      "/api/shorten",
      {
        longURL: $("#longURL").val(),
      },
      (data) => {
        $("#shortened-div").text(
          `Shortned URL: https://tlsr.ga/${data.shortURL}`
        );

        $("#copy-btn").on("click", () => {
          copy(`https://tlsr.ga/${data.shortURL}`);
        });

        page.redirect("/success");
      }
    ).fail(() => {
      page.redirect("/oops");
    });
  });
});
