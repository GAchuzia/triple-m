sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe"
sudo apt-get install -y git
sudo apt-get install -y net-tools
sudo apt-get install -y vim
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
mkdir gitrepos
cd gitrepos && sudo git clone https://github.com/GAchuzia/triple-m.git
cd gitrepos/triple-m && ls -a
