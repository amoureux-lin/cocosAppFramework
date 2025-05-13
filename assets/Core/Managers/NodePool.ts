import { instantiate,Node } from "cc";

export default class NodePool {
    _pool:object = null;
    base_node_list:object = null;

    constructor(){
        this._pool = {};
        this.base_node_list = {};
    }

    initPool( node:any, key:string = null, num:number = 1){
        let tempNode = node;
        let tempKey = key? key:node.name;
        if(!Node["isNode"](tempNode)) tempNode = instantiate(node);
        this.put(tempNode, tempKey);
        for(let i = 1; i < num; i++){
            this.put(instantiate(tempNode), tempKey);
        }
    }

    /**
     * !#en The current available size in the pool
     * !#zh 获取当前缓冲池的可用对象数量
     * @method size
     */
    size(key:string) {
        let pool:[] = [];
        if(key) {
            pool = this._pool[key];
            pool = pool? pool:[];
        } else {
            if (!this._pool[0])
                this._pool[0] = [];
            pool = this._pool[0];
        }
        return pool.length;
    }
    clearAll() {
        for (let i in this._pool) {
            this.clear(i);
        }
        this.base_node_list = {};
    }
    /**
     * !#en Destroy all cached nodes in the pool
     * !#zh 销毁对象池中缓存的所有节点
     * @method clear
     */
    clear(key:string) {
        let pool:Array<Node> = [];
        if(key) {
            pool = this._pool[key];
        } else {
            if (!this._pool[0])
                this._pool[0] = [];
            pool = this._pool[0];
        }
        if(!pool) return;
        for (let i = 0; i < pool.length; ++i) {
            let node:Node = pool[i]
            node.destroy();
            
        }
        if(key) {
            delete this._pool[key];
        }
        delete this.base_node_list[key];
    }

    /**
     * !#en Put a new Node into the pool.
     * It will automatically remove the node from its parent without cleanup.
     * It will also invoke unuse method of the poolHandlerComp if exist.
     * !#zh 向缓冲池中存入一个不再需要的节点对象。
     * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
     * 这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
     * @method put
     * @example
     *   var myNode = instantiate(this.template);
     *   this.myPool.put(myNode);
     *   obj可以为Node或Prefab
     */
    put(obj:any, key:string) {
        if (obj){
            let pool = [];
            if(key) {
                if (!this._pool[key]) {
                    this._pool[key] = [];
                }
                pool = this._pool[key];
            } else {
                if (!this._pool[0])
                    this._pool[0] = [];
                pool = this._pool[0];
            }
            let index = pool.indexOf(obj);
            if(index != -1) {
                pool.splice(index, 1);
            }
            // Remove from parent, but don't cleanup
            if(obj.removeFromParent && obj._components){
                obj.removeFromParent(false);
                for (let i = 0; i < obj._components.length; ++i) {
                    if (obj._components[i].unuse) {
                        obj._components[i].unuse();
                    }
                }
                pool.push(obj);
            }
            this.base_node_list[key] = obj;
        }
    }

    /**
     * !#en Get a obj from pool, if no available object in pool, null will be returned.
     * This function will invoke the reuse function of poolHandlerComp if exist.
     * !#zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
     * @method get
     * @param {any} params - !#en Params to pass to 'reuse' method in poolHandlerComp !#zh 向 poolHandlerComp 中的 'reuse' 函数传递的参数
     * @return {Object|null}
     * @example
     *   var newNode = this.myPool.get();
     */
    get (key:string) {
        let pool = [];
        if(key) {
            pool = this._pool[key];
            if (!pool)
                return null;
        } else {
            if (!this._pool[0])
                this._pool[0] = [];
            pool = this._pool[0];
        }
        // Pop the last object in pool
        let obj = pool.pop();
        if(!obj && this.base_node_list[key]){
            obj = instantiate(this.base_node_list[key]);
        }

        if(obj) {
            // Invoke pool handler
            for (let i = 0; i < obj._components.length; ++i) {
                if (obj._components[i].reuse) {
                    obj._components[i].reuse.apply(obj._components[i], arguments);
                }
            }
        }
        return obj;
    }
};