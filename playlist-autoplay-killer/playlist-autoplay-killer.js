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
 * This action will disable autoplay feature of YouTube play-lists
 * (play-lists will not play next video automatically).
 *
 * @version 1.1
 */

// Action trigger: player ready

var autoplayButton = document.querySelector("#watch7-playlist-bar-autoplay-button.yt-uix-button-toggled")
if (autoplayButton) {
	var click = document.createEvent("MouseEvent")
	click.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 1, null)
	autoplayButton.dispatchEvent(click)
}
