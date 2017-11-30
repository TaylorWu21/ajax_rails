class Game < ApplicationRecord
  has_many :characters
  validates_presence_of :name
end
