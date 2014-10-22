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
 * This action will move lyrics in sidebar. It can also automatically scroll
 * them for you.
 *
 * When auto scroll is enabled two buttons will be added at the bottom of
 * lyrics container - Reset and Stop.
 *
 * Reset can be used to set scroll start and end time. If scrolling has began
 * before it should, click on it when (or shortly before) artist starts singing.
 * This action will recalculate start and end time for auto scroll. If you want
 * to set just end time hold Shift key on your keyboard while you clicking on
 * this button.
 * Once again, click on it to recalculate both start and end time, or hold Shift
 * while clicking to recalculate just end time.
 *
 * If auto scroll is utterly broken (i.e. out of sync) use Stop button to stop
 * it and then you can manually scroll lyrics.
 *
 * If you didn't disabled localStorage start and end time will be saved and
 * automatically loaded next time you watch same video. That is if you changed
 * them. Default times won't be saved.
 *
 * @version 1.6
 */

// Action trigger: document modified

/*! settings begin */
var // Let lyrics height be same as player height (normal player size, not wide).
	limitHeight = true, /* [default = true] [recommended = true] */

	// Height of lyrics container (in pixels).
	// Used only when lyrics height is limited.
	lyricsHeight = 350, /* [default = 350] [no recommended value] */

	// Scroll lyrics automatically.
	// This works only if previous option is true.
	autoScroll = true, /* [default = true] [recommended = true] */

	// Use adaptive scroll speed. This option will produce most smooth
	// scrolling when it's enabled. Lyrics scroll interval will be
	// recalculated so lyrics will always move just one pixel.
	adaptScrollSpeed = true, /* [default = true] [recommended = true] */

	// How often to move lyrics (in milliseconds).
	// Lower number = smoother scrolling (don't go to low).
	// This value will be recalculated if adaptive scroll is enabled.
	scrollInterval = 321, /* [default = 321] [no recommended value] */

	// Start scrolling when video reaches n% (percent) of the length.
	startAt = .15, /* [default = .15] [no recommended value] */

	// Stop scrolling after video reaches n% (percent) of the length.
	// By this time whole lyrics will be scrolled.
	stopAt = .85, /* [default = .85] [no recommended value] */

	// Save start and stop times for lyrics auto scroll so they can be reused
	// when you watch same video again. Uses localStorage to save data.
	// Default values won't be saved.
	storeSettings = true, /* [default = true] [recommended = true] */
/*! settings end */

	sidebar = document.querySelector("#watch7-sidebar, #watch-sidebar"),
	lyrics = document.querySelector(".ext-lyrics"),
	lyricsBody = document.querySelector(".ext-lyrics-body"),
	interval = NaN, previousTime = 0,
	defaultStartAt = startAt, defaultStopAt = stopAt

if (sidebar && lyrics) {
	addStyle()
	sidebar.insertAdjacentElement("afterbegin", lyrics)
	// Set these so lyrics can be placed back in sidebar if they are disabled
	// and then re-enabled in extension preferences.
	// Requires ExtendTube >1.16.5 to work correctly.
	sidebar.classList.add("ext-lyrics-container")
	sidebar.dataset.extLyricsPosition = "afterbegin"

	if (limitHeight && autoScroll)
		autoScrollSetup()
}

function addStyle() {
	var style = document.createElement("style"),
		css = "\
.ext-actions-container {\n\
	float: right;\n\
	border-width: 0;\n\
	z-index: 1;\n\
}\n\
.ext-lyrics {\n\
	margin: 0 0 10px 7px;\n\
	padding: 0 !important;\n\
}\n\
.ext-lyrics:not(:hover) .yt-uix-button-text {\n\
	background: transparent !important;\n\
}\n\
.ext-lyrics:hover .yt-uix-button-text {\n\
	background-image: -o-linear-gradient(top, hsl(0, 0%, 97%) 0px, hsl(0, 0%, 93%) 100%);\n\
	background-image: linear-gradient(to bottom, hsl(0, 0%, 97%) 0px, hsl(0, 0%, 93%) 100%);\n\
	border-color: hsl(0, 0%, 78%);\n\
}\n\
.watch-branded .ext-lyrics {\n\
	margin: -15px 0 10px 7px;\n\
}\n\
.ext-lyrics .ext-lyrics-body {\n\
	padding: 0;\n\
}\n\
.ext-lyrics .comments-section {\n\
	margin: 0;\n\
}\n\
.ext-lyrics .comments-section h4 {\n\
	background-image: none;\n\
	padding: 0 !important;\n\
}\n"

	if (limitHeight)
		css += "\
.ext-lyrics {\n\
	position: relative;\n\
}\n\
.ext-lyrics .comments-section h4 {\n\
	max-height: 15px;\n\
	overflow: hidden;\n\
	text-overflow: ellipsis;\n\
	white-space: nowrap;\n\
}\n\
.ext-lyrics .ext-lyrics-body {\n\
	max-height: " + lyricsHeight + "px;\n\
	overflow: hidden;\n\
}\n\
.ext-lyrics .lyricbox {\n\
	padding-bottom: 5px;\n\
}\n\
.ext-action-move-lyrics-buttons {\n\
	display: none;\n\
	position: absolute;\n\
	bottom: 0;\n\
	right: 0;\n\
	z-index: 1;\n\
}\n\
.ext-lyrics:hover .ext-lyrics-body:not(.ext-hidden) ~ .ext-action-move-lyrics-buttons {\n\
	display: block;\n\
}\n\
.ext-action-move-lyrics-buttons button {\n\
	height: 18px;\n\
}\n\
.ext-action-move-lyrics-buttons button:first-child {\n\
	border-top-right-radius: 0;\n\
	border-bottom-right-radius: 0;\n\
	border-right-width: 0;\n\
}\n\
.ext-action-move-lyrics-buttons button:last-child {\n\
	border-top-left-radius: 0;\n\
	border-bottom-left-radius: 0;\n\
}\n\
.ext-action-move-lyrics-buttons button:first-child:hover {\n\
	border-right-width: 1px;\n\
}\n\
.ext-action-move-lyrics-buttons button:first-child:hover + button {\n\
	border-left-width: 0;\n\
}\n\
.ext-lyrics-scroll-bar {\n\
	padding: 0;\n\
	height: 44px;\n\
	width: 6px;\n\
	border-radius: 3px;\n\
	position: absolute;\n\
	top: 16px;\n\
	right: 0;\n\
	opacity: 0;\n\
}\n\
.ext-lyrics:hover .ext-lyrics-scroll-bar {\n\
	opacity: .6;\n\
}\n\
.ext-lyrics:hover .ext-lyrics-scroll-bar:hover {\n\
	opacity: 1;\n\
}\n"

	style.type = "text/css"
	style.dataset.styleFor = "ext-action-move-lyrics"
	style.textContent = css

	document.querySelector("head").appendChild(style)
}

function autoScrollSetup() {
	var reset, stop, buttons

	lyrics.querySelector(".expand").addEventListener("click", function () {
		// If lyrics are not retrieved wait for them.
		if (!lyricsBody.querySelector(".lyricbox"))
			return setTimeout(arguments.callee, 1e3)

		if (!lyricsBody.querySelector(".ext-lyrics-scroll-bar"))
			addScrollBar()

		if (lyricsBody.classList.contains("ext-hidden"))
			stopScrollingLyrics()
		else
			startScrollingLyrics()
	}, false)

	reset = document.createElement("button")
	reset.className = "yt-uix-tooltip yt-uix-button yt-uix-button-text"
	reset.textContent = "Reset"
	reset.dataset.tooltipText = "Use current time as start of autoscroll."
								+ "<br>(click here once artist starts singing)."
	reset.addEventListener("click", resetButtonListener, false)

	stop = document.createElement("button")
	stop.className = "yt-uix-tooltip yt-uix-button yt-uix-button-text"
	stop.textContent = "Stop"
	stop.dataset.tooltipText = "Stop scrolling."
	stop.addEventListener("click", stopButtonListener, false)

	buttons = document.createElement("span")
	buttons.classList.add("ext-action-move-lyrics-buttons")
	buttons.appendChild(stop)
	buttons.appendChild(reset)
	lyricsBody.insertAdjacentElement("afterend", buttons)
}

function resetButtonListener(event) {
	this.blur()
	var currentTime = xtt.player.api && xtt.player.api.getCurrentTime()
	if (currentTime) {
		if (!event.shiftKey) {
			startAt = (currentTime + (xtt.video.length - currentTime) * .05) / xtt.video.length
			stopAt = (currentTime + (xtt.video.length - currentTime) * stopAt) / xtt.video.length
		}
		else
			stopAt = currentTime * .95 / xtt.video.length

		previousTime = 0
		if (adaptScrollSpeed === null)
			adaptScrollSpeed = true

		logScrollSection()

		if (storeSettings)
			saveSettings()
	}
}

function stopButtonListener(event) {
	this.blur()

	if (interval) {
		stopScrollingLyrics()

		this.textContent = "Start"
		this.dataset.tooltipText = "Start scrolling."
	}
	else {
		startScrollingLyrics()

		this.textContent = "Stop"
		this.dataset.tooltipText = "Stop scrolling."

		if (7e2 < scrollInterval)
			scrollLyrics()
	}
}

function startScrollingLyrics() {
	if (lyricsBody.clientHeight < lyricsBody.scrollHeight) {
		loadSettings()
		interval = setInterval(scrollLyrics, scrollInterval)

		logScrollSection()
	}
	else
		xtt.log.info('Whole lyrics are visible. No need to scroll them.')
}

function stopScrollingLyrics() {
	clearInterval(interval)
	interval = NaN

	xtt.log.info('Lyrics auto scroll is disabled.')
}

function formatTime(seconds) {
	var time = new Date()
	time.setHours(0, 0, 0, 0)
	time.setSeconds(seconds)

	return time.toLocaleTimeString().replace(/^0+(:0?)?/, "")
}

function logScrollSection() {
	xtt.log.info('Lyrics auto scrolling will start when playback reaches '
					 + formatTime(xtt.video.length * startAt) + ' and end when it reaches '
					 + formatTime(xtt.video.length * stopAt) + '.')
}

function scrollLyrics() {
	if (!xtt.player.api)
		return

	var currentTime = xtt.player.api.getCurrentTime(),
		length = xtt.video.length,
		progress

	if (!currentTime || currentTime == previousTime)
		return

	if (Math.abs(currentTime - previousTime) < 2)
		progress = (previousTime + scrollInterval / 1e3) / length
	else
		progress = currentTime / length

	if (progress < startAt) {
		if (3 < Math.abs(currentTime - previousTime))
			lyricsBody.scrollTop = 0
	}
	else if (stopAt < progress) {
		if (3 < Math.abs(currentTime - previousTime))
			lyricsBody.scrollTop = lyricsBody.scrollHeight - lyricsBody.clientHeight
	}
	else {
		if (adaptScrollSpeed) {
			scrollInterval = 1e3 / (lyricsBody.scrollHeight - lyricsBody.clientHeight)
								 * (length * stopAt - length * startAt)

			if (scrollInterval < 50)
				scrollInterval = 50
			else if (1e4 < scrollInterval)
				scrollInterval = 5e3

			clearInterval(interval)
			interval = setInterval(scrollLyrics, scrollInterval)
			adaptScrollSpeed = null

			xtt.log.info('Lyrics scroll interval recalculated. New value is: ' + scrollInterval + '.')
		}

		lyricsBody.scrollTop = (lyricsBody.scrollHeight - lyricsBody.clientHeight)
								   * (currentTime - length * startAt)
								   / (length * stopAt - length * startAt)
	}

	previousTime = currentTime
}

function getSettings() {
	var settings = window.localStorage.getItem("ext-lyrics-auto-scroll-times")
	if (settings)
		return window.JSON.parse(settings)
}

function saveSettings() {
	if (startAt == defaultStartAt && stopAt == defaultStopAt)
		return

	var settings = getSettings() || {}
	settings[xtt.video.getVideoID()] = {
		startAt: startAt,
		stopAt: stopAt
	}

	window.localStorage.setItem("ext-lyrics-auto-scroll-times", window.JSON.stringify(settings))
}

function loadSettings() {
	var settings = getSettings(),
		id = xtt.video.getVideoID()

	if (settings && settings.hasOwnProperty(id)) {
		startAt = settings[id].startAt
		stopAt = settings[id].stopAt
	}
}

function addScrollBar() {
	var scrollBar = document.createElement("button")
		scrollBarHeight = Math.round(Math.pow(lyricsBody.clientHeight, 2) / lyricsBody.scrollHeight)

	scrollBar.className = "yt-uix-button yt-uix-button-text yt-uix-button-default ext-lyrics-scroll-bar"
	scrollBar.style.setProperty("height", scrollBarHeight + "px")
	lyricsBody.appendChild(scrollBar)

	lyricsBody.addEventListener("scroll", function (event) {
		var progress = lyricsBody.scrollTop / (lyricsBody.scrollHeight - lyricsBody.clientHeight)

		scrollBar.style.setProperty("top",
									(lyricsBody.offsetTop
										+ (lyricsBody.clientHeight - scrollBarHeight) * progress)
										+ "px")
	}, false)

	lyricsBody.addEventListener("mousewheel", function (event) {
		event.preventDefault()
		lyricsBody.scrollTop += event.detail * 27
	}, false)

	scrollBar.addEventListener("mousedown", function (event) {
		event.preventDefault()
		var bar = this.getBoundingClientRect(),
			body = lyricsBody.getBoundingClientRect()

		lyricsBody.dataset.scrollStart = body.top + event.clientY - bar.top
		lyricsBody.dataset.scrollEnd = body.top + body.height - bar.top - bar.height + event.clientY

		document.addEventListener("scroll", preventDocumentScroll, false)
		document.addEventListener("mousemove", moveLyrics, false)
		document.addEventListener("mouseup", function mouseUp() {
			document.removeEventListener("scroll", preventDocumentScroll, false)
			document.removeEventListener("mousemove", moveLyrics, false)
			document.removeEventListener("mouseup", mouseUp, false)
		}, false)
	}, false)
}

function moveLyrics(event) {
	var scrollStart = +lyricsBody.dataset.scrollStart,
		scrollEnd = +lyricsBody.dataset.scrollEnd

	lyricsBody.scrollTop = (lyricsBody.scrollHeight - lyricsBody.clientHeight)
							   * (event.clientY - scrollStart) / (scrollEnd - scrollStart)
}

function preventDocumentScroll(event) {
	event.preventDefault()
}
