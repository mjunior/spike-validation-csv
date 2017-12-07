class HomeController < ApplicationController
  def index
   @total = User.all.size
  end

  def batch_process
    puts "** GO BATCH ***"
    User.import( params[:file].tempfile)
    redirect_to root_url, notice: "Usuários importados."
  end
end
