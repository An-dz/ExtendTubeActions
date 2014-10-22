/*
 * Copyright (C) 2012 2013 Darko Pantić <pdarko@myopera.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This action will try to override content warning message.
 *
 * @version 1.1
 */

// Action trigger: document modified

/*! settings begin */
var // Use HTML 5 player.
	useHtml5 = false,
	// Auto update player configuration (highly recommended).
	// When this option is enabled player configuration will be updated
	// when watching video which is not blocked. This data will be used
	// later to write player when it's unavailable. Local storage should
	// be enabled so player configuration can be stored.
	autoUpdatePlayerConfig = true,
/*! settings end */

	playerConfig = {
		assets: {
			css: "http://s.ytimg.com/yts/cssbin/www-player-vflaVD8ra.css",
			css_actions: "http://s.ytimg.com/yts/cssbin/www-player-actions-vflympOE_.css",
			html: "/html5_player_template",
			js: "http://s.ytimg.com/yts/jsbin/html5player-vfll3tTgx.js"
		},
		html5: false,
		min_version: "8.0.0",
		params: {
			allowfullscreen: "true",
			allowscriptaccess: "always",
			bgcolor: "#000000"
		},
		url: "http://s.ytimg.com/yts/swfbin/watch_as3-vfl-KqBih.swf",
		url_v8: "http://s.ytimg.com/yts/swfbin/cps-vflHR5M3s.swf",
		url_v9as2: "http://s.ytimg.com/yts/swfbin/cps-vflHR5M3s.swf"
	},
	player = document.querySelector("#player-api"),
	style

if (!xtt.video.isWatch || !player)
	return

if (player && !player.querySelector("[id*=\"player-unavailable\"]")) {
	if (autoUpdatePlayerConfig)
		updatePlayerConfig()

	return
}

style = document.createElement("style")
style.setAttribute("type", "text/css")
style.dataset.styleFor = "ext-action-cw-override"
style.textContent = "\
.ext-action-cw-override {\n\
	margin: 20px 0;\n\
}\n"
document.querySelector("head").appendChild(style)

addButton(player.querySelector(".content"))

function addButton(node) {
	if (!node)
		return

	var button = createButton({
			"class": "yt-uix-button yt-uix-button-primary yt-uix-tooltip ext-action-cw-override",
			"data-tooltip-text": "Try to override this message"
		}),
		videoId = getVideoId()

	button.textContent = "Override content warning"
	button.addEventListener("click", function () {
		fetchArgs(videoId)
	}, false)
	node.appendChild(button)

	if (!videoId) {
		showMessage("Unable to get video ID.")
		button.disabled = true
		return
	}
}

function createButton(attribute) {
	var button = document.createElement("button")

	Object.keys(attribute).forEach(function (property) {
		button.setAttribute(property, attribute[property])
	})

	return button
}

function fetchArgs(videoId) {
	showMessage("Requesting video arguments...")
	var xhr = new window.XMLHttpRequest()

	xhr.open("get", "http://www.youtube.com/get_video_info?el=popout&video_id=" + videoId, true)
	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4)
			return

		var buttonContainer = xtt.ui.add.downloadButton(),
			args = decodeArgs(xhr.responseText)

		if (args.status == "fail")
			return showMessage(args.reason.replace(/\+/g, " "))

		showMessage("Player arguments fetched.")

		yt.playerConfig = getPlayerConfig(args)

		if (buttonContainer) {
			buttonContainer = buttonContainer.parentNode
			xtt.ui.remove.downloadButton()
			xtt.ui.add.downloadButton(buttonContainer)
		}

		showMessage("Attempting to write player...")

		yt.player.embed("player-api", yt.playerConfig)
	}
	xhr.send()
}

function getVideoId() {
	return yt.config_.VIDEO_ID
}

function decodeArgs(args) {
	args = args.split("&").reduce(function (previous, current) {
		current = current.split("=")
		previous[current[0]] = current[1] && decodeURIComponent(current[1])

		return previous
	}, {})

	return args
}

function showMessage(message) {
	var msgBox = player.querySelector(".ext-action-cwo-message")

	if (!msgBox) {
		msgBox = document.createElement("p")
		msgBox.classList.add("ext-action-cwo-message")
		player.querySelector(".ext-action-cw-override").insertAdjacentElement("afterend", msgBox)
	}

	msgBox.textContent = message
}

function getPlayerConfig(args) {
	var config = window.localStorage["ext-action-cwo-player-config"]

	if (config)
		config = JSON.parse(config)

	if (!config || !config.assets || !config.url)
		config = playerConfig

	config.html5 = useHtml5
	config.args = args

	return config
}

function updatePlayerConfig() {
	if (!yt.playerConfig || typeof yt.playerConfig != "object")
		return

	var config = {}
	Object.keys(yt.playerConfig).forEach(function (key) {
		if (key != "args")
			config[key] = yt.playerConfig[key]
	})

	window.localStorage["ext-action-cwo-player-config"] = JSON.stringify(config)
}
