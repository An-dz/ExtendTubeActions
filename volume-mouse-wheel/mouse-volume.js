/*
 * Copyright (C) 2012 Darko Pantić <pdarko@myopera.com>
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
 * This action will allow you to change volume using mouse wheel.
 *
 * Based on action provided by wergenwolf (wergenwolf@myopera.com).
 * See: http://my.opera.com/pdarko/blog/show.dml/50435532#comment99005812
 *
 * NOTE:
 * - doesn't work when flash player is in full screen mode
 * - doesn't work on Linux when flash player is used
 *
 * @version 1.0
 */

// Action trigger: page loaded

document.addEventListener("mousewheel", function (event) {
	if (!xtt.player.playerElement)
		return

    // Check if the mouse is on top of player
    if (event.target == xtt.player.playerElement ||
		xtt.player.playerElement.compareDocumentPosition(event.target) &
		window.Node.DOCUMENT_POSITION_CONTAINED_BY) {
        // Prevent page scroll
        event.preventDefault()

        //Check if the scrolling is up or down
        if (0 < event.detail)
            xtt.player.control("volume", "-5%")
        else
            xtt.player.control("volume", "+5%")
    }
}, false)
