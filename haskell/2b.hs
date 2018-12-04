import Data.List
import Data.Maybe

main = do
  input <- readFile "2b-input.txt"
  let ids = sort $ words $ input
  putStr $ fromJust $ compareIds ids
  return ()

isOffByOne :: String -> String -> Maybe String
isOffByOne a b
  | length matches == (length a) - 1 = Just matches
  | otherwise                        = Nothing
    where matches = intersect a b

compareIds :: [String] -> Maybe String
compareIds [] = Nothing
compareIds [x] = Nothing
compareIds (x:y:zs) 
  | isJust (isOffByOne x y) = (isOffByOne x y)
  | otherwise               = compareIds (y:zs)