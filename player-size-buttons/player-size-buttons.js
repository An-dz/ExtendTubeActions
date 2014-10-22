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
 * This action will add buttons below player to change its size
 * (small = 640x390; medium = 854x510; large = 1280x750).
 *
 * @version 1.4
 */

// Action trigger: document modified

/*! settings begin */
var reverseToolTips = true,
	addTo = {
		// reference node for adding buttons
		node: document.querySelector(".ext-actions-right"),
		// where to add buttons relative to reference node;
		// beforebegin, afterbegin, beforeend or afterend
		where: "beforeend"
	}
/*! settings end */

if (!addTo.node || !xtt.video.isWatch)
	return

addStyle()
addTo.node.insertAdjacentElement(addTo.where, createSizeButtons())
resizePlayer(window.localStorage.getItem("ext-custom-player-size") || "watch-small")

function addStyle() {
	var style = document.createElement("style"),
		css = "\
#ext-player-small-button img,\n\
#ext-player-medium-button img,\n\
#ext-player-large-button img {\n\
	box-sizing: border-box;\n\
	border: 1px solid black;\n\
	background: hsla(0, 0%, 0%, .2);\n\
}\n\
.ext-light-icon #ext-player-small-button img,\n\
.ext-light-icon #ext-player-medium-button img,\n\
.ext-light-icon #ext-player-large-button img {\n\
	border: 1px solid white;\n\
	background: hsla(0, 0%, 100%, .2);\n\
}\n\
#ext-player-small-button img {\n\
	width: 9px;\n\
	height: 5px;\n\
}\n\
#ext-player-medium-button img {\n\
	width: 13px;\n\
	height: 8px;\n\
}\n\
#ext-player-large-button img {\n\
	width: 18px;\n\
	height: 11px;\n\
}\n"

	style.setAttribute("type", "text/css")
	style.dataset.styleFor = "ext-action-player-size-buttons"
	style.textContent = css

	document.querySelector("head").appendChild(style)
}

function createSizeButtons() {
	var container = document.createElement("span"),
		small = createButton({
			"class": getButtonClass() + " ext-button-start",
			"id": "ext-player-small-button",
			"data-tooltip-text": "Player size: small",
			"data-player-size": "watch-small"
		}),
		medium = createButton({
			"class": getButtonClass() + " ext-button-middle",
			"id": "ext-player-medium-button",
			"data-tooltip-text": "Player size: medium",
			"data-player-size": "watch-medium"
		}),
		large = createButton({
			"class": getButtonClass() + " ext-button-end",
			"id": "ext-player-large-button",
			"data-tooltip-text": "Player size: large",
			"data-player-size": "watch-large"
		})

	container.appendChild(small)
	container.appendChild(medium)
	container.appendChild(large)

	small.addEventListener("click", resizePlayer, false)
	medium.addEventListener("click", resizePlayer, false)
	large.addEventListener("click", resizePlayer, false)

	return container
}

function resizePlayer(size) {
	if (typeof size != "string")
		size = this.dataset.playerSize

	document.querySelector("#watch7-container").className = size

	if (size == "watch-small") {
		document.querySelector("#watch7-container").classList.remove("watch-wide")
		document.querySelector("#watch7-container").classList.remove("watch-playlist-collapsed")
	}
	else {
		document.querySelector("#watch7-container").classList.add("watch-wide")
		document.querySelector("#watch7-container").classList.add("watch-playlist-collapsed")
	}

	Array.prototype.forEach.call(document.querySelectorAll("button[data-player-size]"), function (node) {
		if (node.dataset.playerSize == size)
			node.classList.add("yt-uix-button-active")
		else
			node.classList.remove("yt-uix-button-active")
	})

	window.localStorage.setItem("ext-custom-player-size", size)
}

function createButton(attribute) {
	var button = document.createElement("button")

	for (var p in attribute)
		button.setAttribute(p, attribute[p])

	return button.appendChild(document.createElement("img")), button
}

function getButtonClass() {
	var buttonClass = "yt-uix-button yt-uix-button-text yt-uix-tooltip ext-button"
	if (reverseToolTips)
		return buttonClass + " yt-uix-tooltip-reverse"
	return buttonClass
}
