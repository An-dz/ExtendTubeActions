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
 * This action will rewrite playlist links.
 *
 * @version 1.1
 */

// Action trigger: page loaded

Array.prototype.forEach.call(document.querySelectorAll("a[href*=\"/watch\"]"), function (link) {
	if (link.search)
		link.search = link.search.replace(/&?(list|playnext|index)=[^&]+/g, "")
})
