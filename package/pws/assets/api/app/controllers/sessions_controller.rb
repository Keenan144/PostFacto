#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
require 'clients/google_client'

class SessionsController < ApplicationController
  def create
    google_user = GOOGLE_CLIENT.get_user!(params.fetch(:access_token))

    user = User.find_by!(email: google_user[:email])

    render json: { auth_token: user.auth_token, new_user: user.retros.empty? }
  rescue GoogleClient::InvalidUserDomain
    head :forbidden
  rescue GoogleClient::GetUserFailed
    head :internal_server_error
  end
end
