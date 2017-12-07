class User < ApplicationRecord
  def self.import(file)
    CSV.foreach(file,{ headers:true}) do |row|
      user = User.create({
        name: row[0],
        email: row[1],
        city: row[3],
        identifier: row[11]
      })
      user.save
    end
  end
end
