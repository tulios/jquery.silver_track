require 'json'
require 'sinatra'

get '/echo/json/:page' do
  content_type :json
  headers("Access-Control-Allow-Origin" => "*")

  { total_pages: params[:total_pages] || 1, data: JSON.parse(params[:json] || "[]") }.to_json
end
