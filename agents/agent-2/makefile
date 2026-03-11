# Directorios
SRCDIR = ./src
INCLUDE_DIR = ./include
BUILD_DIR = ./build

# Variables
CC = gcc
CFLAGS = -Wall -g -I$(INCLUDE_DIR)
LDFLAGS = -L/path/to/libs

# Archivos fuente (ahora desde src)
SRC = $(wildcard $(SRCDIR)/*.c)

# Archivos objeto (convertir cada .c en su correspondiente .o en build)
OBJ = $(SRC:$(SRCDIR)/%.c=$(BUILD_DIR)/%.o)

# Objetivo por defecto
all: $(BUILD_DIR)/traffic_lighter

# Regla para compilar el programa
$(BUILD_DIR)/traffic_lighter: $(OBJ)
	$(CC) $(CFLAGS) -o $@ $(OBJ) -lwiringPi -lmariadb $(LDFLAGS)

# Regla para compilar archivos .c a .o y crear subdirectorios
$(BUILD_DIR)/%.o: $(SRCDIR)/%.c | $(BUILD_DIR)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Crea el directorio build si no existe
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# Regla para limpiar los archivos compilados
clean:
	rm -rf $(BUILD_DIR)

# Dependencias específicas (añadir manualmente según sea necesario)
$(BUILD_DIR)/main.o: $(INCLUDE_DIR)/agent.h $(INCLUDE_DIR)/utils.h
$(BUILD_DIR)/connections.o: $(INCLUDE_DIR)/connections.h
$(BUILD_DIR)/tasks.o: $(INCLUDE_DIR)/agent.h $(INCLUDE_DIR)/utils.h

.PHONY: all clean
