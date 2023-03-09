workspace {

    model {
    # user agents
        user = person "User" "A user of vSelf software system."
        dao = person "vSelf DAO" "Team members with root level access" "DAO"
        
        # external systems
        near = softwareSystem "NEAR Blockchain" "NEAR"
        filecoin = softwareSystem "Filecoin Blockchain"
        cdns = softwareSystem "Content Delivery Networks"
        
        # vself software components
        vself = softwareSystem "vSelf Software" "Cloud native digital agent and identity management tool" {
            group "Frontend" {
                mobileApp = container "Mobile Application" "Mobile app delivered through Google Play and Apple stores" "Unity" "MobileApp"
                webApp = container "vSelf Web Application" "Allows for identity management and other user stories" "Next.js + Tailwind CSS" "WebApp"
            }
            
            group "Backend Layer 1" {
                vselfApp = container "vSelf API Service" "Allows authenticated interaction with vSelf Cloud" "Next.js + tRPC" "API"
                storage = container "vSelf Storage" "Stores and serves large data files and syncs it with Filecoin network" "Powergate API/Firebase Storage" "Storage"
                database = container "vSelf Database" "Stores user owned data, as well as public data obtained from indexer" "Graph database GunBD" "Database"
            }
            
            group "Backend Layer 2" {
                contracts = container "vSelf smart-contracts" "Business logic and source of truth" "Written in Rust" "Contracts"
                indexer = container "Indexer Service + Fast NEAR RPC Endpoint" "Syncs with NEAR blockchain and indexes on-chain data" "Rust + Docker" "Indexer"
                analytics = container "vSelf Monitoring Service" "Aggregates analitics from various sources" "Pagoda + Google Analytics" "Analytics"
            }
        }
        
        #inter container relationships
        webApp -> vselfApp "Uses API" "HTTPS"
        webApp -> database "Reads from and writes to" "WebRTC"
        webApp -> storage "Writes to / reads from" "IPFS/HTPS"
        mobileApp -> vselfApp "Uses API" "HTTPS"
        mobileApp -> storage "Writes to / reads from"
        vselfApp -> contracts "Interacts on-chain" "near-js-sdk"        
        storage -> filecoin "Writes to"
        indexer -> database "Writes to"
        
        # container-context relationships
        indexer -> near "Read from"
        contracts -> near "Executed on"
        user -> webApp "Interacts with"
        user -> mobileApp "Interacts with"
        dao -> analytics "Operates and monitors"
        dao -> contracts "Deploys"
        dao -> vselfApp "Documents and maintains cloud API"
        
        # context level relationships
        user -> vself "Uses to manage identity"
        dao -> near "Manages contracts"
        vself -> near "Uses as public ledger"
        vself -> filecoin "Uses as distributed storage"
        dao -> vself "Does dev ops and decision making"
    }

    views {
        systemContext vself "SystemContext" {
            include *
            autoLayout
        }
        
        container vself {
            include *
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            
            element "Database" {
                shape cylinder
            }
            
            element "DAO" {
                shape Robot
            }
            
            element "WebApp" {
                shape WebBrowser
            }
            
            element "MobileApp" {
                shape MobileDevicePortrait
            }

            element "Storage" {
                shape Folder
            }

            element "Indexer" {
                shape Hexagon
            }
        }
    }
    
}
