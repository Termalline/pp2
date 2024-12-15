npm install
docker build -f Dockerfile.c -t c_dockerfile . 
docker build -f Dockerfile.cpp -t cpp_dockerfile .
docker build -f Dockerfile.go -t go_dockerfile .
docker build -f Dockerfile.java -t java_dockerfile .
docker build -f Dockerfile.js -t node_dockerfile .
docker build -f Dockerfile.php -t php_dockerfile .
docker build -f Dockerfile.pl -t perl_dockerfile . 
docker build -f Dockerfile.py -t python_dockerfile .
docker build -f Dockerfile.rb -t ruby_dockerfile .
docker build -f Dockerfile.rc -t r_dockerfile .
docker build -f Dockerfile.rs -t rust_dockerfile .